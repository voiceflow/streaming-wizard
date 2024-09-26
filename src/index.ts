import * as readline from "readline";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createParser } from "eventsource-parser";

// import environment variables
dotenv.config();

async function callApi(action: { type: string; payload: any }): Promise<void> {
  const queryParams = new URLSearchParams({
    completion_events: "true",
    ...(process.env.ENVIRONMENT && { environment: process.env.ENVIRONMENT }),
  });

  const response = await fetch(
    `${process.env.RUNTIME_ENDPOINT}/v2/project/${process.env.PROJECT_ID}/user/test_user_123/interact/stream?${queryParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.API_KEY}`,
      },
      body: JSON.stringify({ action }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(`API failed ${response.status} ${await response.text()}`);
  }

  const parser = createParser((event) => {
    if (event.type === "event" && event.event === "trace") {
      const trace = JSON.parse(event.data);
      switch (trace.type) {
        case "speak":
          console.log(trace.payload.message);
          break;
        case "text":
          console.log(trace.payload.message);
          break;
        case "end":
          console.log("[conversation ended]");
          process.exit(0);
        // completion events flag
        case "completion-start":
          process.stdout.write(trace.payload.completion ?? "");
          break;
        case "completion-continue":
          process.stdout.write(trace.payload.completion ?? "");
          break;
        case "completion-end":
          process.stdout.write(trace.payload.completion ?? "" + "\n");
          break;
      }
    }
  });

  return new Promise((resolve, reject) => {
    response.body!.on("data", (chunk) => {
      parser.feed(chunk.toString());
    });

    response.body!.on("end", resolve);
    response.body!.on("error", reject);
  });
}

// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.on("line", (line) => {
  const userMessage = line.trim();
  if (!userMessage.length) {
    rl.prompt();
    return;
  }

  callApi({ type: "text", payload: userMessage })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      rl.prompt();
    });
});

// start the conversation by sending a launch event
(async () => {
  await callApi({ type: "launch", payload: {} });
  rl.prompt();
})();

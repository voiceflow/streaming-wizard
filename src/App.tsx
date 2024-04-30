import { createSignal, type Component } from 'solid-js';
import {SSE, _SSEvent} from 'sse.js';

import styles from './App.module.css';
import { TextCompletion } from './components/TextCompletion';
import { Query } from './components/Query';

const App: Component = () => {
  const url = `https://general-runtime-review-streaming.us.development.voiceflow.com/v2beta1/interact/${import.meta.env.VITE_PROJECT_ID}/${import.meta.env.VITE_VERSION_ID}/stream`;

  const [value, setValue] = createSignal<string[]>([]);
  let queryRef!: HTMLInputElement;

  function start(payload: string) {
    setValue([]);

    queryRef.disabled = true;

    const source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}`
      },
      payload: JSON.stringify({
        "action": {
          "type": "text",
          "payload": payload
        },
        "session": {
          "sessionID": "1",
          "userID": "1"
        }
      }),
      method: "POST",
      start: false
    });

    source.addEventListener('trace', (event: _SSEvent) => {
      const payload = JSON.parse(event.data);
      console.log(payload.trace)

      switch (payload.trace.type) {
        case "completion-start": {
          setValue([])
          break;
        }
        case "completion-continue": {
          setValue((val) => [...val, payload.trace.payload.completion]);
          break;
        }
        case "completion-end": {
          source.close();
          queryRef.disabled = false;
          break;
        }
      }
    });

    source.stream();
  }

  function preventDefault(fn: (e: Event) => any) {
    return (e: Event) => {
      e.preventDefault();
      return fn(e);
    }
  }

  return (
    <div class={styles.App}>
      <h1 class={styles.Header}>What answers do you seek?</h1>
      <h2 class={styles.SubHeader}>🔮</h2>

      <form onSubmit={preventDefault(() => start(queryRef.value))}>
        <Query ref={(el) => queryRef = el} />
      </form>

      <span class={styles.Spacer}></span>

      { value().length > 0 && <TextCompletion value={value} /> }
    </div>
  );
};

export default App;

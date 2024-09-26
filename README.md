# Streaming Wizard

> [!WARNING]
> You should never expose your `API_KEY` on any frontend or user-facing client.

A quick example of using the Voiceflow runtime streaming API.

![DEMO](https://github.com/user-attachments/assets/bef7a392-75c7-40f9-8e58-17929e87db09)


Docs:
* https://docs.voiceflow.com/reference/stateinteractstream
* https://docs.voiceflow.com/reference/stream-completion-events-1

## Installation

Clone this repository and install the dependencies (`yarn install`)

## Usage

Create a `.env` file containing the following information (fill out `PROJECT_ID` and `API_KEY`):
For your development env, whenever you make changes to the project, be sure click "Run" first to ensure it is in the latest state.

```
RUNTIME_ENDPOINT="https://general-runtime.voiceflow.com"
PROJECT_ID=
API_KEY=
ENVIRONMENT=development
```

Start up the project using `yarn dev`

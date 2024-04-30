import { For, type Accessor, type Component } from 'solid-js';

import styles from './TextCompletion.module.css';

export interface TextCompletionProps {
  value: Accessor<string[]>
}

export const TextCompletion: Component<TextCompletionProps> = (props) => {
  return (
    <div class={styles.TextCompletion}>
      <For each={props.value()}>{(word, i) => (
        <span class={styles.Text}>{word}</span>
      )}</For>
    </div>
  );
}

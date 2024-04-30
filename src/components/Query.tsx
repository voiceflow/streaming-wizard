import type { Accessor, Component, Setter } from 'solid-js';

import styles from './Query.module.css';

export interface QueryProps {
  ref: HTMLInputElement;
}

export const Query: Component<QueryProps> = (props) => {
  return (
    <input ref={props.ref} class={styles.Query}
      type="text"
    />
  );
}

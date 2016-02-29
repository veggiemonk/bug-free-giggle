import m from 'mithril';

import styles from './input.css!';

let Button = {};

Button.view = ( c, props, children ) => {
  //TODO: jspm install classnames or no need?
  return (
    <input type={props.type}
           class={`${styles.input} ${props.className || ''}`}
           placeholder={props.placeholder}
      {...props}>
      {children}
    </input>
  );
};

export default Button;

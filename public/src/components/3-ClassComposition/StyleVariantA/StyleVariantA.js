import styles from './StyleVariantA.css';

import m from 'mithril';

export default class StyleVariantA extends Component {

  render() {
    return (
      <div className={styles.root}>
        <p className={styles.text}>Style Variant A</p>
      </div>
    );
  }

};

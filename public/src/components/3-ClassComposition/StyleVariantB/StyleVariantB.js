import styles from './StyleVariantB.css';

import m from 'mithril';

export default class StyleVariantB extends Component {

  render() {
    return (
      <div className={styles.root}>
        <p className={styles.text}>Style Variant B</p>
      </div>
    );
  }

};

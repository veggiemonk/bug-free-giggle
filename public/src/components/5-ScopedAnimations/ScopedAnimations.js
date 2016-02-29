import styles from './ScopedAnimations.css';

import m from 'mithril';

export default class ScopedAnimations extends Component {

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.ball} />
      </div>
    );
  }

};

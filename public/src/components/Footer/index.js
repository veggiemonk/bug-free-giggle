import m from 'mithril';
import styles from './style.css';
let Footer = {};

Footer.view = ( c, props, children ) => {
  return m( 'footer#Footer', { class: styles.Footer }, [
    m( 'p', 'Group S' )
  ] );
};

export default Footer;

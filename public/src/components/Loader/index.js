import m from 'mithril';
import styles from './style.css!';

let Loader = {};

Loader.view = ( c, props, children ) => {
  return (
    <div class={`${styles.Loader}`}
         style={props.display ? 'display: block;' : 'display: none;'}>
      <div>{
        m( 'svg', { viewBox: '25 25 50 50' }, [
          m( 'circle', { cx: '50', cy: '50', r: '20', fill: 'none', 'stroke-width': '3' } )
        ] )
      }</div>
    </div>
  );
};


export default Loader;

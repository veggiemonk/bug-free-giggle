import m from 'mithril';

import App from './src/';

//import Header from './src/components/Header';
//import Footer from './src/components/Footer';

/*
 import finalCreateStore from 'src/redux/createStore';
 import reducer from 'src/redux/reducers/index';

 let store = finalCreateStore(reducer);
 store.subscribe(m.redraw.bind(m));
 */

document.addEventListener("DOMContentLoaded", function(event) {
  m.mount( document.getElementById( 'app' ), m.component( App/*, {store: store}*/ ) );
  //m.mount(document.getElementById('footer'), m.component(Footer));
});

import m from 'mithril';
import 'isomorphic-fetch';


let App = {};

const headers = method => {
  return {
    method:   method,
    mode:     'cors',
    redirect: 'follow',
    headers:  {
      Accept:         'application/json',
      'Content-Type': 'application/json'
    }
  };
};

const getTranslations = ( cb ) => {
  try {
    //m.startComputation();
    return fetch( 'http://localhost:3000/v1/translation' )
      .then( ( res ) => res.json() )
      .then( ( translation ) => {
        cb( translation );
        //m.endComputation()
      } ).catch( ( err ) => {
        console.log( err );
      } )
  } catch ( e ) {}
}

const getKeys = ( cb ) => {
  try {
    m.startComputation();
    return fetch( 'http://localhost:3000/v1/key'/*, headers('GET')*/ )
      .then( ( res ) => res.json() )
      .then( ( keys ) => {
        cb( keys );
        console.log('cb:', cb());
        m.endComputation()
      } ).catch( ( err ) => {
        console.log( err );
      } )
  } catch ( e ) {}
};

App.controller = ( props ) => {
  let c = {};
  //Keys
  c.keys = m.prop([]);
  getKeys( c.keys );

  //Translations
  c.translations = m.prop([]);
  //getTranslations( c.translations );
  return c;
};

const listKeys = ( ...keys ) => (
  <div class="list-group">
    {keys.map( ( k ) => (
      <a class="list-group-item" key={k.ID} href="#">
        {k.KEY}<i class="fa fa-chevron-circle-right" style="float: right;"></i>
      </a>
    ) ) }
  </div>)
const listTrad = ( ...translations ) => {
  return translations.map( ( t ) => (
    <div class="list-group">
      <input class="list-group-item" placeholder={t.EN}/>
      <input class="list-group-item" placeholder={t.FR}/>
      <input class="list-group-item" placeholder={t.NL}/>
    </div>
  ) )
};

App.view = ( c, props ) => {

  const k = listKeys();
  const t = listTrad();

  console.log( 'NOW:', Date.now(), t, k );
  return (
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3"><h4>Keys</h4></div>
        <div class="col-md-3"><h4>EN</h4></div>
        <div class="col-md-3"><h4>FR</h4></div>
        <div class="col-md-3"><h4>NL</h4></div>
      </div>
      <div class="row">
        <div class="col-md-3">{ k }</div>
        <div class="col-md-9">{ t }</div>
      </div>
    </div>
  )
};

export default App;

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

const getData = ( cb ) => {
  try {
    m.startComputation();
    return fetch( 'http://localhost:3000/v1/key'/*, headers('GET')*/ )
      .then( ( res ) => res.json() )
      .then( ( keys ) => {
        cb( keys );
        m.endComputation()
      } ).catch( ( err ) => {
        console.log( err );
      } )
  } catch ( e ) {}
};

App.controller = ( props ) => {
  let c  = {};
  c.keys = m.prop();
  //const cb = ( k ) => { c.data( k ) };
  getData( c.keys );
  return c;
};


App.view = ( c, props ) => {

  const listKeys = () => {
    return c.keys().map( ( k ) => {
      return <a class="list-group-item" key="{k.ID}" href="#">
        {k.KEY}<i class="fa fa-chevron-circle-right" style="float: right;"></i>
      </a>;
    } )
  };
  const k        = listKeys();

  const listTrad = () => {
    return c.keys().map( ( k ) => {
      return <input class="list-group-item" placeholder={k.KEY}/>
    } )
  }
  const t        = listTrad();

  return (
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <h4>Keys</h4>
          <div class="list-group">
            { k }
          </div>
        </div>
        <div class="col-md-3">
          <h4>EN</h4>
          <div class="list-group">
            {t}
          </div>
        </div>
        <div class="col-md-3">
          <h4>FR</h4>
          <div class="list-group">
            {t}
          </div>
        </div>
        <div class="col-md-3">
          <h4>NL</h4>
          <div class="list-group">
            {t}
          </div>
        </div>
      </div>
    </div>
  )
};

export default App;

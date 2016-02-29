import m from 'mithril';
import { setLanguage, loginFailed, sendLogin } from '../../redux/actions';
import { dispatchLogin } from '../../async';
import { urlServer } from '../../settings';

import styles from './login.css!';
import styleR from '../../css/radio.css!';

let Login = {};

const parseField = (dispatch) => {
  const login    = String( document.querySelector( '#fieldUser' ).value );
  const password = String( document.querySelector( '#fieldPassword' ).value );

  return {
    login,
    password,
  };
};
//TODO: make middleware
const submitLogin = ({dispatch, e}) => {
  console.log( e );
  const o = parseField( dispatch );
  o ? dispatch( sendLogin( { ...o, dispatch } ) ) : alert( 'ERROR' );
};

Login.view = (c, props) => {
  const { i18n, language, display, dispatch } = props;
  const i = k => i18n.t( k, { lng: language } );
  //console.log('redraw');
  return (
    <div class={`${styles.overlay}`}
         style={display ? 'display: block;' : 'display: none;'}>
      <div class={`${styles.body}`}>
        <div class={`${styles.container}`}>
          <div class={`${styles.profile} ${styles.profile_open}`}>
            <button class={`${styles.profile__avatar} ${styles.profile_open} ${styles.button} `}>
              <img class={`${styles.img}`} src="src/css/img/groupsLOGO.jpg" alt="Avatar">
              </img>
            </button>
            <div class={`${styles.profile__form}`}>
              <form class={`${styles.profile__fields}`} action={urlServer + '/login'} method="post">
                <p class={`${styles.field}`}>
                  <input type="text" name="login" id="fieldUser" class={`${styles.input}`} required/>
                  <label for="fieldUser" class={`${styles.label}`}>{i( 'login.login' )}</label>
                </p>
                <p class={`${styles.field}`}>
                  <input type="password" name="password" id="fieldPassword" class={`${styles.input}`} required/>
                  <label for="fieldPassword"
                         class={`${styles.label}`}>{i( 'login.password' )}</label>
                </p>
                <div class={`${styles.grid}`}>
                  <div class={`${styles.col_1_3} `}>
                    <input class={`${styleR.input}`} type="radio" id="radio1" name="en"
                           checked={language.toLowerCase() === 'en'}/>
                    <label class={`${styleR.label}`} for="radio1"
                           onclick={() => {dispatch(setLanguage('en'));}}>
                      <span></span>
                      EN
                    </label>
                  </div>
                  <div class={`${styles.col_1_3}`}>
                    <input class={`${styleR.input}`} type="radio" id="radio2" name="fr"
                           checked={language.toLowerCase() === 'fr'}/>
                    <label class={`${styleR.label}`} for="radio2"
                           onclick={() => {dispatch(setLanguage('fr'));}}>
                      <span></span>
                      FR
                    </label>
                  </div>
                  <div class={`${styles.col_1_3}`}>
                    <input class={`${styleR.input}`} type="radio" id="radio3" name="nl"
                           checked={language.toLowerCase() === 'nl'}/>
                    <label class={`${styleR.label}`} for="radio3"
                           onclick={() => {dispatch(setLanguage('nl'));}}>
                      <span></span>
                      NL
                    </label>
                  </div>
                </div>
                <div class={`${styles.profile__footer}`}>
                  <button type="submit"
                          class={`${styles.button} ${styles.btn}`}
                          onsubmit={(e) => { submitLogin({dispatch, e}); } }>
                    {i( 'login.submit' ).toUpperCase()}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

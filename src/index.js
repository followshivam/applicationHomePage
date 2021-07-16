import React,{ Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { encryptTransform } from 'redux-persist-transform-encrypt';
import reducers from 'redux/reducer'
import App from './App'
import './i18n';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['reportDetails','loginDetails','globalSettings','regexDetails'],
  transforms: [
     encryptTransform({
        secretKey: 'my-secret-key-test567',
        onError: function (error) {
           console.log('encryptTransform error : ', error);
        },
     }),
  ],
}

const persistedReducer = persistReducer(persistConfig, reducers)
let store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
let persistor = persistStore(store)


ReactDOM.render(
  <React.StrictMode>
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         {/* <ThemeProvider theme={theme}> */}
         <Router basename={`${process.env.REACT_APP_CONTEXT_PATH}`}>
            <Suspense fallback={(<div className="Loading_fallback">Loading...</div>)}>
              <App />    
            </Suspense>
         </Router>
         {/* </ThemeProvider> */}
      </PersistGate>
   </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStore } from 'redux'
import reducers from 'redux/reducer'
import { encryptTransform } from 'redux-persist-transform-encrypt';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['reportDetails', 'loginDetails', 'globalSettings'],
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

export { store, persistor };

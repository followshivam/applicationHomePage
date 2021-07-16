import React from 'react'
import { Router } from 'react-router';
import { Suspense } from 'react';
import { createMemoryHistory } from 'history'
import '../i18n';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from 'redux/store';

export const Wrapper = (props) => {
    const history = createMemoryHistory()
    return (<Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router history={history} basename={`${process.env.REACT_APP_CONTEXT_PATH}`} {...props.options}>
                <Suspense fallback=''>
                    {props.children}
                </Suspense>
            </Router>
        </PersistGate>
    </Provider>
    );
}
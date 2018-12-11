import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

// redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './redux/reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import './index.css';
import Router from './Router';
import FetchSpinner from './view/components/FetchSpinner';
import * as serviceWorker from './serviceWorker';

const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    pReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

render(
    <Provider store={store}>
        <PersistGate 
            loading={ <FetchSpinner /> } 
            persistor={persistor}
        >
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers.js';
import { updateLocation } from './reducers/location';

export default () => {
    // ======================================================
    // Middleware Configuration
    // ======================================================
    const middleware = [thunk];

    // ======================================================
    // Store Enhancers
    // ======================================================
    const enhancers = [];
    if (__DEV__) {
        const devToolsExtension = window.devToolsExtension;
        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension());
        }
    }

    // ======================================================
    // Store Instantiation and HMR Setup
    // ======================================================
    const store = createStore(
        makeRootReducer(),
        undefined,
        compose(
            autoRehydrate(),
            applyMiddleware(...middleware),
            ...enhancers
        )
    );

    persistStore(
        store,
        {
            blacklist: []
        },
        appReady
    );

    function appReady() {
        document.body.style.opacity = 1;
        document.body.style.transform = 'initial';
        document.body.style.webkitTransform = 'initial';
    }

    store.asyncReducers = {};

    // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
    //store.unsubscribeHistory = history.listen(updateLocation(store));

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const reducers = require('./reducers').default;
            store.replaceReducer(reducers(store.asyncReducers));
        });
    }

    return store;
};

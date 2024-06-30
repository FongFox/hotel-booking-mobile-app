// redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk'; // for version 2.x
const thunk = require('redux-thunk').thunk; // since version 3
import logger from 'redux-logger';
// reducers
import { leaders } from './leaders';
import { hotels } from './hotels';
import { comments } from './comments';
import { promotions } from './promotions';
import { favorites } from './favorites';
// redux-persist
import { persistStore, persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const config = { key: 'root', storage: AsyncStorage, debug: true };

export const ConfigureStore = () => {
    const store = createStore(
        persistCombineReducers(config, {
            leaders, hotels, comments, promotions, favorites
        }),
        applyMiddleware(thunk, logger)
    );
    const persistor = persistStore(store);
    return { persistor, store };
};
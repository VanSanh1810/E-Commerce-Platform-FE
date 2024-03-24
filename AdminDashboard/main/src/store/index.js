import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authReducer';
import toastReducer from './reducers/toastReducer';
import { persistReducer, persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['toastReducer'],
};

const rootReducer = combineReducers({
    authReducer: authReducer,
    toastReducer: toastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        persistedReducer,
    },
});

export const persistor = persistStore(store);

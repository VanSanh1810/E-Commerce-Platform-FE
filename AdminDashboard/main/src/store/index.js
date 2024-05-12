import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authReducer';
import toastReducer from './reducers/toastReducer';
import { persistReducer, persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';

const rootReducer = combineReducers({
    authReducer: authReducer,
    toastReducer: toastReducer,
    notificationReducer: notificationReducer,
});

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage,
        blacklist: ['toastReducer', 'notificationReducer'],
    },
    rootReducer,
);

export const store = configureStore({
    reducer: {
        persistedReducer,
    },
});

export const persistor = persistStore(store);

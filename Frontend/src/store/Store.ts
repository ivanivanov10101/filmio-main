import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from './features/user/userSlice';

const rootReducer = combineReducers({
    user: userSlice,
});

const persistConfig = { key: 'root', storage, version: 1 };

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDeafaultMiddleware) => getDeafaultMiddleware({ serializableCheck: false }),
});

export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

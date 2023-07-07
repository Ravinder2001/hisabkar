import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import UserSlice from "./slices/UserSlice";
import OtherSlice from "./slices/OtherSlice";
import FilterSlice from "./slices/FilterSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["FilterSlice"]
};

const RootReducers = combineReducers({
  UserSlice,
  OtherSlice,
  FilterSlice
});


const persistedReducer = persistReducer(persistConfig, RootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import AddGroupSlice from "./slices/AddGroupSlice";
import SplitSlice from "./slices/SplitSlice";

const persistConfig = {
  key: "root",
  storage,
};

const RootReducers = combineReducers({
  AddGroupSlice,
  SplitSlice,
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

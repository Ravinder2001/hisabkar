import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./features/userSlice";
import dataSlice from "./features/dataSlice";

// Define persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine your reducers
const rootReducer = combineReducers({
  user: userSlice,
  data: dataSlice,
  // Add other reducers here
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {user: UserState, ...}
export type AppDispatch = typeof store.dispatch;

export { store, persistor };

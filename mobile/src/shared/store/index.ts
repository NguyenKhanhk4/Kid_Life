import { configureStore } from '@reduxjs/toolkit';

// Placeholder store configuration.
// Slices will be added here as features are implemented.
export const store = configureStore({
  reducer: {
    // Add reducers here later
    _dummy: (state = {}) => state,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Often disabled in React Native due to navigation state serialization
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

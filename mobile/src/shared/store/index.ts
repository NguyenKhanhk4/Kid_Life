import { configureStore } from '@reduxjs/toolkit';
import { kidlifeReducer } from './kidlifeSlice';

export const store = configureStore({
  reducer: {
    kidlife: kidlifeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './hooks';
export * from './kidlifeSlice';

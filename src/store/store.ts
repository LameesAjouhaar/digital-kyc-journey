
import { configureStore } from '@reduxjs/toolkit';

import kycWorkflowReducer from './slices/kycWorkflowSlice';

export const store = configureStore({
  reducer: {
    kycWorkflow: kycWorkflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

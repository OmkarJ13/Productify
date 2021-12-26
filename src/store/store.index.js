import { configureStore } from "@reduxjs/toolkit";
import { currentTimerReducer } from "./slices/currentTimerSlice";
import { timerEntryReducer } from "./slices/timerEntrySlice";

const store = configureStore({
  reducer: {
    currentTimerReducer,
    timerEntryReducer,
  },
});

export default store;

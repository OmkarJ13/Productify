import { configureStore } from "@reduxjs/toolkit";
import { currentTimerReducer } from "./slices/currentTimerSlice";
import { timerEntryReducer } from "./slices/timerEntrySlice";
import { tagReducer } from "./slices/tagSlice";
import { todoReducer } from "./slices/todoSlice";

const store = configureStore({
  reducer: {
    currentTimerReducer,
    timerEntryReducer,
    tagReducer,
    todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

import { configureStore } from "@reduxjs/toolkit";

import { timerReducer } from "./slices/timerSlice";
import { timerEntryReducer } from "./slices/timerEntrySlice";
import { tagReducer } from "./slices/tagSlice";
import { todoReducer } from "./slices/todoSlice";
import { userReducer } from "./slices/userSlice";

const store = configureStore({
  reducer: {
    timerReducer,
    timerEntryReducer,
    tagReducer,
    todoReducer,
    userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

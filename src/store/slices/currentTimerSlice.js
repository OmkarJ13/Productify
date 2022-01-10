import { createSlice } from "@reduxjs/toolkit";
import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

let state = {};
const currentTimer = JSON.parse(localStorage.getItem("currentTimer"));
if (currentTimer) {
  restoreTimerEntry(currentTimer);
  state = { currentTimer };
} else {
  localStorage.setItem("currentTimer", JSON.stringify(null));
  state = { currentTimer: null };
}

const currentTimerSlice = createSlice({
  name: "currentTimer",
  initialState: state,
  reducers: {
    start(_, action) {
      return { currentTimer: action.payload };
    },

    stop() {
      return { currentTimer: null };
    },
  },
});

export const currentTimerReducer = currentTimerSlice.reducer;
export const currentTimerActions = currentTimerSlice.actions;

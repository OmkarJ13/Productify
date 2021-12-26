import { createSlice } from "@reduxjs/toolkit";
import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

const parseCurrentTimer = (currentTimerJSON) => {
  const currentTimer = JSON.parse(currentTimerJSON);
  restoreTimerEntry(currentTimer.timerEntry);

  return currentTimer;
};

const initialState = {
  currentTimer: null,
};

const state =
  "currentTimer" in localStorage
    ? parseCurrentTimer(localStorage.getItem("currentTimer"))
    : initialState;

const currentTimerSlice = createSlice({
  name: "currentTimer",
  initialState: state,
  reducers: {
    start(_, action) {
      return {
        currentTimer: action.payload,
      };
    },

    stop() {
      return {
        currentTimer: null,
      };
    },
  },
});

export const currentTimerReducer = currentTimerSlice.reducer;
export const currentTimerActions = currentTimerSlice.actions;

import { createSlice } from "@reduxjs/toolkit";
import { parseTimerEntriesJSON } from "../../helpers/parseTimerEntriesJSON";

const defaultState = {
  timerEntries: [],
};

const state =
  "timerEntries" in localStorage
    ? parseTimerEntriesJSON(localStorage.getItem("timerEntries"))
    : defaultState;

const timerEntrySlice = createSlice({
  name: "timerEntry",
  initialState: state,
  reducers: {
    create(state, action) {
      const { timerEntries } = state;
      return {
        timerEntries: [action.payload, ...timerEntries],
      };
    },

    update(state, action) {
      const { timerEntries } = state;
      const editedTimerEntries = timerEntries.map((cur) => {
        if (cur.id === action.payload.id) {
          return action.payload;
        }

        return cur;
      });

      return {
        timerEntries: editedTimerEntries,
      };
    },

    delete(state, action) {
      const { timerEntries } = state;
      const filteredTimerEntries = timerEntries.filter((cur) => {
        return cur.id !== action.payload.id;
      });

      return {
        timerEntries: filteredTimerEntries,
      };
    },
  },
});

export const timerEntryReducer = timerEntrySlice.reducer;
export const timerEntryActions = timerEntrySlice.actions;

import { createSlice } from "@reduxjs/toolkit";
import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

let state = {};
let timerEntries = JSON.parse(localStorage.getItem("timerEntries"));
if (timerEntries) {
  timerEntries = timerEntries.map((timerEntry) =>
    restoreTimerEntry(timerEntry)
  );
  state = { timerEntries };
} else {
  localStorage.setItem("timerEntries", JSON.stringify([]));
  state = { timerEntries: [] };
}

const timerEntrySlice = createSlice({
  name: "timerEntry",
  initialState: state,
  reducers: {
    create(state, action) {
      const { timerEntries } = state;
      return { timerEntries: [action.payload, ...timerEntries] };
    },

    update(state, action) {
      const { timerEntries } = state;
      const editedTimerEntries = timerEntries.map((cur) => {
        if (cur.id === action.payload.id) {
          return action.payload;
        }

        return cur;
      });

      return { timerEntries: editedTimerEntries };
    },

    delete(state, action) {
      const { timerEntries } = state;
      const filteredTimerEntries = timerEntries.filter((cur) => {
        return cur.id !== action.payload.id;
      });

      return { timerEntries: filteredTimerEntries };
    },
  },
});

export const timerEntryReducer = timerEntrySlice.reducer;
export const timerEntryActions = timerEntrySlice.actions;

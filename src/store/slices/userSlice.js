import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { auth } from "../../firebase.config";
import store from "../store.index";
import { getTagsAsync } from "./tagSlice";
import { getTimerEntriesAsync } from "./timerEntrySlice";
import { getTimerAsync } from "./timerSlice";
import { getTodosAsync } from "./todoSlice";

const initialState = {
  user: null,
};

const handleAuthChanged = (user) => {
  store.dispatch(setUserAsync(user));
};

auth.onAuthStateChanged(handleAuthChanged);

const setUserAsync = createAsyncThunk(
  "user/setUserAsync",
  async (user, thunkAPI) => {
    thunkAPI.dispatch(userSlice.actions.setUser(user));
    await Promise.all(
      thunkAPI.dispatch(getTimerEntriesAsync()),
      thunkAPI.dispatch(getTodosAsync()),
      thunkAPI.dispatch(getTagsAsync()),
      thunkAPI.dispatch(getTimerAsync())
    );
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, user: action.payload };
    },
  },
});

export const userReducer = userSlice.reducer;

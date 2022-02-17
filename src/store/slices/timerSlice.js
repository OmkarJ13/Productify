import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

const initialState = {
  loading: true,
  timer: null,
};

export const getTimerAsync = createAsyncThunk(
  "timer/getTimerAsync",
  async (_, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const timerCollectionRef = collection(db, "users", userID, "timer");
    const docData = await getDocs(timerCollectionRef);

    const timer = {
      id: docData.docs[0].id,
      ...docData.docs[0].data(),
    };

    return restoreTimerEntry(timer);
  }
);

export const startTimerAsync = createAsyncThunk(
  "timer/startTimerAsync",
  async (timer, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const timerCollectionRef = collection(db, "users", userID, "timer");

    const flattenedTimer = {
      ...timer,
      date: timer.date.toISO(),
      startTime: timer.startTime.toISO(),
      endTime: timer.endTime.toISO(),
      duration: timer.duration.toISO(),
    };

    const addedDoc = await addDoc(timerCollectionRef, flattenedTimer);

    return { id: addedDoc.id, ...timer };
  }
);

export const stopTimerAsync = createAsyncThunk(
  "timer/stopTimerAsync",
  async (timer, thunkAPI) => {
    thunkAPI.dispatch(timerSlice.actions.stopTimer());

    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const docRef = doc(db, "users", userID, "timer", timer.id);
    await deleteDoc(docRef);
  }
);

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    stopTimer(state, action) {
      return { ...state, timer: null };
    },
  },
  extraReducers: {
    [getTimerAsync.pending]: (state, action) => {
      return { loading: true, timer: null };
    },
    [getTimerAsync.fulfilled]: (state, action) => {
      return { loading: false, timer: action.payload };
    },
    [startTimerAsync.fulfilled]: (state, action) => {
      return { timer: action.payload };
    },
  },
});

export const timerReducer = timerSlice.reducer;

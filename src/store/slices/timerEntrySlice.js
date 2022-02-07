import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";

import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

const initialState = {
  loading: true,
  timerEntries: [],
};

export const getTimerEntriesAsync = createAsyncThunk(
  "timerEntry/getTimerEntriesAsync",
  async (_, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const timerEntriesCollectionRef = collection(
      db,
      "users",
      userID,
      "timerEntries"
    );
    const docData = await getDocs(timerEntriesCollectionRef);

    const timerEntries = docData.docs.map((doc) => {
      const timerEntry = {
        id: doc.id,
        ...doc.data(),
      };

      return restoreTimerEntry(timerEntry);
    });

    return timerEntries;
  }
);

export const addTimerEntryAsync = createAsyncThunk(
  "timerEntry/addTimerEntryAsync",
  async (timerEntry, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const timerEntriesCollectionRef = collection(
      db,
      "users",
      userID,
      "timerEntries"
    );

    const flattenedTimerEntry = {
      ...timerEntry,
      date: timerEntry.date.toISO(),
      startTime: timerEntry.startTime.toISO(),
      endTime: timerEntry.endTime.toISO(),
      duration: timerEntry.duration.toISO(),
    };

    const addedDoc = await addDoc(
      timerEntriesCollectionRef,
      flattenedTimerEntry
    );

    return { id: addedDoc.id, ...timerEntry };
  }
);

export const updateTimerEntryAsync = createAsyncThunk(
  "timerEntry/updateTimerEntryAsync",
  async (timerEntry, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const flattenedTimerEntry = {
      ...timerEntry,
      date: timerEntry.date.toISO(),
      startTime: timerEntry.startTime.toISO(),
      endTime: timerEntry.endTime.toISO(),
      duration: timerEntry.duration.toISO(),
    };
    const { id, ...updatedStuff } = flattenedTimerEntry;

    const docRef = doc(db, "users", userID, "timerEntries", id);
    await updateDoc(docRef, updatedStuff);

    return timerEntry;
  }
);

export const deleteTimerEntryAsync = createAsyncThunk(
  "timerEntry/deleteTimerEntryAsync",
  async (timerEntry, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const docRef = doc(db, "users", userID, "timerEntries", timerEntry.id);
    await deleteDoc(docRef);

    return timerEntry;
  }
);

const timerEntrySlice = createSlice({
  name: "timerEntry",
  initialState,
  extraReducers: {
    [getTimerEntriesAsync.pending]: (state, action) => {
      return { loading: true, timerEntries: [] };
    },
    [getTimerEntriesAsync.fulfilled]: (state, action) => {
      return { loading: false, timerEntries: action.payload };
    },
    [addTimerEntryAsync.fulfilled]: (state, action) => {
      const { timerEntries } = state;
      return { timerEntries: [action.payload, ...timerEntries] };
    },
    [updateTimerEntryAsync.fulfilled]: (state, action) => {
      const { timerEntries } = state;
      const editedTimerEntries = timerEntries.map((cur) => {
        if (cur.id === action.payload.id) {
          return action.payload;
        }

        return cur;
      });

      return { timerEntries: editedTimerEntries };
    },
    [deleteTimerEntryAsync.fulfilled]: (state, action) => {
      const { timerEntries } = state;
      const filteredTimerEntries = timerEntries.filter((cur) => {
        return cur.id !== action.payload.id;
      });

      return { timerEntries: filteredTimerEntries };
    },
  },
});

export const timerEntryReducer = timerEntrySlice.reducer;

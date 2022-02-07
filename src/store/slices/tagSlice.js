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

const initialState = {
  loading: true,
  tags: [],
};

export const getTagsAsync = createAsyncThunk(
  "tag/getTagsAsync",
  async (_, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const tagsCollectionRef = collection(db, "users", userID, "tags");
    const docData = await getDocs(tagsCollectionRef);

    const tags = docData.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return tags;
  }
);

export const addTagAsync = createAsyncThunk(
  "tag/addTagAsync",
  async (tag, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const tagsCollectionRef = collection(db, "users", userID, "tags");
    const addedDoc = await addDoc(tagsCollectionRef, tag);

    return {
      id: addedDoc.id,
      ...tag,
    };
  }
);

export const updateTagAsync = createAsyncThunk(
  "tag/updateTagAsync",
  async (tag, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const { id, ...updatedStuff } = tag;

    const docRef = doc(db, "users", userID, "tags", id);
    await updateDoc(docRef, updatedStuff);

    return tag;
  }
);

export const deleteTagAsync = createAsyncThunk(
  "tag/deleteTagAsync",
  async (tag, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const docRef = doc(db, "users", userID, "tags", tag.id);
    await deleteDoc(docRef);

    return tag;
  }
);

const tagSlice = createSlice({
  name: "tag",
  initialState,
  extraReducers: {
    [getTagsAsync.pending]: (state, action) => {
      return { loading: true, tags: [] };
    },
    [getTagsAsync.fulfilled]: (state, action) => {
      return { loading: false, tags: action.payload };
    },
    [addTagAsync.fulfilled]: (state, action) => {
      const { tags } = state;
      return {
        tags: [action.payload, ...tags],
      };
    },
    [updateTagAsync.fulfilled]: (state, action) => {
      const { tags } = state;
      const editedTags = tags.map((tag) => {
        if (tag.id === action.payload.id) {
          return action.payload;
        }

        return tag;
      });

      return { tags: editedTags };
    },
    [deleteTagAsync.fulfilled]: (state, action) => {
      const { tags } = state;
      const filteredTags = tags.filter((tag) => {
        return tag.name !== action.payload.name;
      });

      return { tags: filteredTags };
    },
  },
});

export const tagReducer = tagSlice.reducer;

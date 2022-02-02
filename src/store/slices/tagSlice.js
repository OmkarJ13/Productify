import { createSlice } from "@reduxjs/toolkit";

let state = {};
const tags = JSON.parse(localStorage.getItem("tags"));
if (tags) {
  state = { tags };
} else {
  localStorage.setItem("tags", JSON.stringify([]));
  state = { tags: [] };
}

const tagSlice = createSlice({
  name: "tag",
  initialState: state,
  reducers: {
    create(state, action) {
      const { tags } = state;
      return {
        tags: [action.payload, ...tags],
      };
    },
    update(state, action) {
      const { tags } = state;
      const editedTags = tags.map((tag) => {
        if (tag.id === action.payload.id) {
          return action.payload;
        }

        return tag;
      });

      return { tags: editedTags };
    },
    delete(state, action) {
      const { tags } = state;
      const filteredTags = tags.filter((tag) => {
        return tag.name !== action.payload.name;
      });

      return { tags: filteredTags };
    },
  },
});

export const tagReducer = tagSlice.reducer;
export const tagActions = tagSlice.actions;

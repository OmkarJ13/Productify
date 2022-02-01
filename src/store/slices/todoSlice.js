import { createSlice } from "@reduxjs/toolkit";
import { restoreTodo } from "../../helpers/restoreTodo";

let state = {};
let todos = JSON.parse(localStorage.getItem("todos"));
if (todos) {
  todos = todos.map((todo) => restoreTodo(todo));
  state = { todos };
} else {
  localStorage.setItem("todos", JSON.stringify([]));
  state = { todos: [] };
}

const todoSlice = createSlice({
  name: "todo",
  initialState: state,
  reducers: {
    create(state, action) {
      const { todos } = state;
      return {
        todos: [action.payload, ...todos],
      };
    },

    update(state, action) {
      const { todos } = state;
      const editedTodos = todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return action.payload;
        }

        return todo;
      });

      return {
        todos: editedTodos,
      };
    },

    delete(state, action) {
      const { todos } = state;
      const filteredTodos = todos.filter((todo) => {
        return todo.id !== action.payload.id;
      });

      return {
        todos: filteredTodos,
      };
    },
  },
});

export const todoReducer = todoSlice.reducer;
export const todoActions = todoSlice.actions;

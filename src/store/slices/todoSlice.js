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

import { restoreTodo } from "../../helpers/restoreTodo";

const initialState = {
  loading: true,
  todos: [],
};

export const getTodosAsync = createAsyncThunk(
  "todo/getTodosAsync",
  async (_, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const todosCollectionRef = collection(db, "users", userID, "todos");
    const docData = await getDocs(todosCollectionRef);

    const todos = docData.docs.map((doc) => {
      const todo = {
        id: doc.id,
        ...doc.data(),
      };

      return restoreTodo(todo);
    });

    return todos;
  }
);

export const addTodoAsync = createAsyncThunk(
  "todo/addTodoAsync",
  async (todo, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const todosCollectionRef = collection(db, "users", userID, "todos");

    const flattenedTodo = {
      ...todo,
      date: todo.date.toISO(),
    };

    const addedDoc = await addDoc(todosCollectionRef, flattenedTodo);

    return { id: addedDoc.id, ...todo };
  }
);

export const updateTodoAsync = createAsyncThunk(
  "todo/updateTodoAsync",
  async (todo, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const flattenedTodo = {
      ...todo,
      date: todo.date.toISO(),
    };

    const { id, ...updatedStuff } = flattenedTodo;

    const docRef = doc(db, "users", userID, "todos", id);
    await updateDoc(docRef, updatedStuff);

    return todo;
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todo/deleteTodoAsync",
  async (todo, thunkAPI) => {
    const { userReducer } = thunkAPI.getState();
    const userID = userReducer.user.uid;

    const docRef = doc(db, "users", userID, "todos", todo.id);
    await deleteDoc(docRef);

    return todo;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  extraReducers: {
    [getTodosAsync.pending]: (state, action) => {
      return { loading: true, todos: [] };
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      return { loading: false, todos: action.payload };
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      const { todos } = state;
      return {
        ...state,
        todos: [action.payload, ...todos],
      };
    },
    [updateTodoAsync.fulfilled]: (state, action) => {
      const { todos } = state;
      const editedTodos = todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return action.payload;
        }

        return todo;
      });

      return {
        ...state,
        todos: editedTodos,
      };
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
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

import { DateTime } from "luxon";

// Restores Luxon dates after retrieved from db
export const restoreTodo = (todo) => {
  const restoredTodo = {
    ...todo,
    date: DateTime.fromISO(todo.date),
    doneTime: todo.doneTime && DateTime.fromISO(todo.doneTime),
  };

  return restoredTodo;
};

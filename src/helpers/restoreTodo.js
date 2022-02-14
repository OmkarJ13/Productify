import { DateTime } from "luxon";

export const restoreTodo = (todo) => {
  const restoredTodo = {
    ...todo,
    date: DateTime.fromISO(todo.date),
    doneTime: todo.doneTime && DateTime.fromISO(todo.doneTime),
  };

  return restoredTodo;
};

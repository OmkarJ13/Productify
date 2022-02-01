import { DateTime } from "luxon";

export const restoreTodo = (todo) => {
  const restoredTodo = {
    ...todo,
    date: DateTime.fromISO(todo.date),
  };

  return restoredTodo;
};

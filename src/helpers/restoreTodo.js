import { DateTime } from "luxon";

export const restoreTodo = (todo) => {
  todo.date = DateTime.fromISO(todo.date);
  return todo;
};

import { DateTime } from "luxon";

export const restoreTodo = (todo) => {
  todo.dueDate = DateTime.fromISO(todo.dueDate);
  return todo;
};

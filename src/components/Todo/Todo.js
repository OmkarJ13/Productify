import React from "react";

import TodoCreator from "./TodoCreator";
import TodoForm from "./TodoForm";

class Todo extends React.Component {
  componentDidMount() {
    document.title = "Todo | Productify";
  }

  render() {
    return (
      <div className="w-10/12 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <TodoForm UI={TodoCreator} />
      </div>
    );
  }
}

export default Todo;

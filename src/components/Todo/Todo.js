import React from "react";

import TodoCreator from "./TodoCreator";
import TodoStateManager from "./TodoStateManager";
import Todos from "./Todos";

class Todo extends React.Component {
  componentDidMount() {
    document.title = "Todo | Productify";
  }

  render() {
    return (
      <div className="w-10/12 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <TodoStateManager UI={TodoCreator} />
        <Todos />
      </div>
    );
  }
}

export default Todo;

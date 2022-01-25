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
      <div className="w-[85%] min-h-screen flex flex-col gap-6 ml-auto p-6 text-gray-600">
        <TodoStateManager
          renderTodo={(otherProps) => {
            return <TodoCreator {...otherProps} />;
          }}
        />
        <Todos />
      </div>
    );
  }
}

export default Todo;

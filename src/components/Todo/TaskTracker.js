import React from "react";

import TodoCreator from "./TodoCreator";
import TodoStateManager from "./TodoStateManager";
import Todos from "./Todos";

class TaskTracker extends React.Component {
  componentDidMount() {
    document.title = "Tasks | Productify";
  }

  render() {
    return (
      <div className="ml-auto flex min-h-screen w-[85%] flex-col gap-6 p-6 text-gray-600">
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

export default TaskTracker;

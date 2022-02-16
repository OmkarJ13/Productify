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
      <div className="mb-auto flex h-[90%] w-full flex-col gap-4 overflow-y-auto p-6 text-gray-600 xl:mb-0 xl:ml-auto xl:min-h-screen xl:w-[85%] xl:gap-6">
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

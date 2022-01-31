import React from "react";

import WindowHandler from "../UI/WindowHandler";
import TodoTrackerWindow from "./TodoTrackerWindow";

class TodoTracker extends React.Component {
  render() {
    const { onManualTimeEntered, onStartTracking, timerActive, ...otherProps } =
      this.props;
    return (
      <WindowHandler
        {...otherProps}
        renderWindow={(otherProps) => {
          return (
            <TodoTrackerWindow
              onManualTimeEntered={onManualTimeEntered}
              onStartTracking={onStartTracking}
              {...otherProps}
            />
          );
        }}
      >
        {this.props.children}
      </WindowHandler>
    );
  }
}

export default TodoTracker;

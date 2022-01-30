import React from "react";

import FloatingWindowHandler from "../UI/FloatingWindowHandler";
import TodoTrackerWindow from "./TodoTrackerWindow";

class TodoTracker extends React.Component {
  render() {
    const { onManualTimeEntered, onStartTracking, timerActive, ...otherProps } =
      this.props;
    return (
      <FloatingWindowHandler
        {...otherProps}
        Window={(otherProps) => {
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
      </FloatingWindowHandler>
    );
  }
}

export default TodoTracker;

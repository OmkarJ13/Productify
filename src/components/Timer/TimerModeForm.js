import React from "react";
import "./TimerModeForm";

class TimerModeForm extends React.Component {
  render() {
    const { task } = this.props.timerEntry;

    return (
      <>
        <input
          name="task"
          type="text"
          className="Timer__task-input"
          value={task}
          placeholder="What are you working on?"
          autoComplete="off"
          onChange={this.props.taskChangeHandler}
        />

        <button onClick={this.props.startTracking} className="Timer__start-btn">
          Start Tracking
        </button>
        <div className="Timer__modes flex-column">
          <button
            onClick={this.props.switchToManualMode}
            className="Timer__timer-mode-btn"
          >
            <i className="fa fa-clock-o" />
          </button>
          <button
            onClick={this.props.switchToManualMode}
            className="Timer__manual-mode-btn"
          >
            <i className="fa fa-bars" />
          </button>
        </div>
      </>
    );
  }
}

export default TimerModeForm;

import React from "react";
import "./TimerModeForm";

class TimerModeForm extends React.Component {
  render() {
    const { task, isProductive } = this.props.timerEntry;

    return (
      <>
        <input
          name="task"
          type="text"
          className="flex-grow p-2 border border-gray-300 focus:outline-none"
          value={task}
          placeholder="What are you doing?"
          autoComplete="off"
          onChange={this.props.taskChangeHandler}
        />

        <button onClick={this.props.productiveChangeHandler}>
          <i
            className={`fa fa-line-chart ${
              isProductive && "text-blue-500 font-bold"
            }`}
          />
        </button>

        <button
          onClick={this.props.startTracking}
          className="px-4 py-2 bg-blue-500 text-white uppercase"
        >
          Start Tracking
        </button>
        <div className="flex flex-col">
          <button onClick={this.props.switchToTimerMode}>
            <i
              className={`fa fa-clock-o ${
                this.props.trackingMode === "timer" && "text-gray-600 font-bold"
              }`}
            />
          </button>
          <button onClick={this.props.switchToManualMode}>
            <i
              className={`fa fa-bars ${
                this.props.trackingMode === "manual" &&
                "text-gray-600 font-bold"
              }`}
            />
          </button>
        </div>
      </>
    );
  }
}

export default TimerModeForm;

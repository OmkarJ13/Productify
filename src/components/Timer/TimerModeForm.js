import React from "react";
import "./TimerModeForm";

class TimerModeForm extends React.Component {
  render() {
    const { task, duration, isProductive, isBillable } = this.props.timerEntry;

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

        <div className="flex items-center">
          <button onClick={this.props.productiveChangeHandler} className="px-4">
            <i
              className={`fa fa-line-chart ${
                isProductive && "text-blue-500 font-bold"
              }`}
            />
          </button>

          <button onClick={this.props.billableChangeHandler} className="px-4">
            <i
              className={`fa fa-dollar ${
                isBillable && "text-blue-500 font-bold"
              }`}
            />
          </button>
        </div>

        <span className="px-8 text-center text-black border-l border-dotted border-gray-300">
          {duration.toTimeString()}
        </span>

        {this.props.isTracking ? (
          <button
            onClick={this.props.stopTracking}
            className="w-1/12 px-4 py-2 bg-red-500 text-white uppercase"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={this.props.startTracking}
            className="w-1/12 px-4 py-2 bg-blue-500 text-white uppercase"
          >
            Start
          </button>
        )}

        <div className="flex flex-col justify-center items-center">
          {this.props.isTracking ? (
            <button onClick={this.props.discardTimer}>
              <i className="fa fa-close" />
            </button>
          ) : (
            <>
              <button onClick={this.props.switchToTimerMode}>
                <i
                  className={`fa fa-clock-o ${
                    this.props.trackingMode === "timer" &&
                    "text-gray-600 font-bold"
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
            </>
          )}
        </div>
      </>
    );
  }
}

export default TimerModeForm;

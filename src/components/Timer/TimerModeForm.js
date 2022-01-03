import {
  AttachMoney,
  Close,
  LocalOffer,
  Menu,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import React from "react";

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

        <button className="px-4">
          <LocalOffer />
        </button>

        <div className="h-full flex items-center">
          <button
            onClick={this.props.productiveChangeHandler}
            className={`h-full px-4 border-x border-dotted border-gray-300 ${
              isProductive ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <TrendingUp />
          </button>

          <button
            onClick={this.props.billableChangeHandler}
            className={`h-full px-4 border-x border-dotted border-gray-300 ${
              isBillable ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <AttachMoney />
          </button>
        </div>

        <span className="h-full flex items-center px-8 text-center text-base">
          {duration.toFormat("hh:mm:ss")}
        </span>

        {this.props.currentTimer !== null ? (
          <button
            onClick={this.props.stopTracking}
            className="w-1/12 p-2 bg-gradient-to-br from-red-500 to-red-400 text-white uppercase"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={this.props.startTracking}
            className="w-1/12 p-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
          >
            Start
          </button>
        )}

        <div className="flex flex-col justify-center items-center pl-4">
          {this.props.currentTimer !== null ? (
            <button onClick={this.props.discardTimer}>
              <Close fontSize="small" />
            </button>
          ) : (
            <>
              <button
                onClick={this.props.switchToTimerMode}
                className={`${
                  this.props.trackingMode === "timer"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                <Schedule fontSize="small" />
              </button>
              <button
                onClick={this.props.switchToManualMode}
                className="text-gray-400"
              >
                <Menu fontSize="small" />
              </button>
            </>
          )}
        </div>
      </>
    );
  }
}

export default TimerModeForm;

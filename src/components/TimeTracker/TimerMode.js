import {
  AttachMoney,
  Close,
  LocalOffer,
  Menu,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";

import React from "react";

import { DateTime, Duration } from "luxon";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import { currentTimerActions } from "../../store/slices/currentTimerSlice";
import { timerEntryActions } from "../../store/slices/timerEntrySlice";

class TimerMode extends React.Component {
  constructor(props) {
    super(props);

    this.timerID = undefined;

    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.discardTimer = this.discardTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.reloadHandler = this.reloadHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.reloadHandler);

    if (this.shouldRestore()) {
      this.restoreTimer();
    }
  }

  componentDidUpdate() {
    if (this.shouldRestore()) {
      this.restoreTimer();
    }
  }

  timerExists() {
    return this.timerID !== undefined;
  }

  reloadHandler() {
    if (this.timerExists()) {
      this.resetTimer();
      this.storeCurrentTimer();
    }
  }

  startTracking(e) {
    const timerEntry = {
      ...this.props.timerEntry,
      startTime: DateTime.now(),
    };

    this.props.startTimer(timerEntry);
    this.timerID = setInterval(this.updateTimer, 1000);
  }

  updateTimer() {
    const { timerEntry } = this.props;
    const prevDuration = timerEntry.duration;
    const newDuration = prevDuration.plus(Duration.fromMillis(1000));

    this.props.onDurationChanged(newDuration);
  }

  stopTracking(e) {
    this.resetTimer();

    const timerEntry = {
      ...this.props.timerEntry,
      id: uuid(),
      endTime: DateTime.now(),
    };

    this.props.stopTimer(timerEntry);
    this.props.resetState();

    "currentTimer" in localStorage && localStorage.removeItem("currentTimer");
  }

  discardTimer(e) {
    this.props.discardTimer();

    this.resetTimer();
    this.props.resetState();
  }

  shouldRestore() {
    return this.props.currentTimer !== null && !this.timerExists();
  }

  restoreTimer() {
    const { currentTimer } = this.props;

    if (currentTimer === null) {
      console.error("Tried to restore a timer that did not exist");
      return;
    }

    this.timerID = setInterval(this.updateTimer, 1000);

    this.props.updateState({
      timerEntry: {
        ...currentTimer,
        duration: DateTime.now().diff(currentTimer.startTime),
      },
    });
  }

  storeCurrentTimer() {
    const { timerEntry } = this.props;
    localStorage.setItem("currentTimer", JSON.stringify(timerEntry));
  }

  resetTimer() {
    clearInterval(this.timerID);
    this.timerID = undefined;
  }

  componentWillUnmount() {
    if (this.timerExists()) {
      this.resetTimer();
      this.storeCurrentTimer();
    }

    window.removeEventListener("beforeunload", this.reloadHandler);
  }

  render() {
    const { task, isProductive, isBillable, duration } = this.props.timerEntry;

    return (
      <>
        <input
          name="task"
          type="text"
          className="flex-grow p-2 border border-gray-300 focus:outline-none"
          value={task}
          placeholder="What are you doing?"
          autoComplete="off"
          onChange={this.props.onTaskChanged}
        />

        <button
          title="Select Tag"
          className="px-4"
          onClick={this.props.onTagClicked}
        >
          <LocalOffer />
        </button>

        <div className="h-full flex items-center">
          <button
            title="Is Productive?"
            onClick={this.props.onProductiveChanged}
            className={`h-full px-4 border-x border-dotted border-gray-300 ${
              isProductive ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <TrendingUp />
          </button>

          <button
            title="Is Billable?"
            onClick={this.props.onBillableChanged}
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
            onClick={this.stopTracking}
            className="w-1/12 p-2 bg-gradient-to-br from-red-500 to-red-400 text-white uppercase"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={this.startTracking}
            className="w-1/12 p-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
          >
            Start
          </button>
        )}

        <div className="flex flex-col justify-center items-center pl-4">
          {this.props.currentTimer !== null ? (
            <button title="Discard Timer" onClick={this.discardTimer}>
              <Close fontSize="small" />
            </button>
          ) : (
            <>
              <button
                title="Timer Mode"
                onClick={this.props.onSwitchTimerMode}
                className={`${
                  this.props.trackingMode === "timer"
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                <Schedule fontSize="small" />
              </button>
              <button
                title="Manual Mode"
                onClick={this.props.onSwitchManualMode}
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

const mapStateToProps = (state) => {
  return {
    currentTimer: state.currentTimerReducer.currentTimer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTimer: (timerEntry) => {
      dispatch(currentTimerActions.start(timerEntry));
    },

    stopTimer: (timerEntry) => {
      dispatch(currentTimerActions.stop());
      dispatch(timerEntryActions.create(timerEntry));
    },

    discardTimer: () => {
      dispatch(currentTimerActions.stop());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerMode);

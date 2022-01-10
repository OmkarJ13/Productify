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
import TagSelector from "../Tag/TagSelector";

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

    localStorage.setItem("currentTimer", JSON.stringify(null));
  }

  discardTimer(e) {
    this.props.discardTimer();

    this.resetTimer();
    this.props.resetState();

    localStorage.setItem("currentTimer", JSON.stringify(null));
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
    const { task, isProductive, isBillable, tag, duration } =
      this.props.timerEntry;

    return (
      <div className="w-full flex items-center gap-4 p-4 shadow-md border border-gray-200 text-sm">
        <div className="w-[75%] h-full flex items-center gap-4 border-r border-dotted border-gray-300">
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
            className="w-[15%] relative h-full"
            onClick={this.props.onTagClicked}
          >
            {this.props.selectingTag && (
              <TagSelector
                onClose={this.props.onTagClosed}
                onTagSelected={this.props.onTagSelected}
              />
            )}

            {tag === undefined ? (
              <div className="flex justify-center items-center gap-2">
                <LocalOffer />
                <span className="text-xs">Add Tag</span>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <LocalOffer htmlColor={tag.color} fontSize="small" />
                <span className="text-xs">{tag.name}</span>
              </div>
            )}
          </button>

          <div className="h-full flex items-center">
            <button
              title="Is Productive?"
              onClick={this.props.onProductiveChanged}
              className={`h-full px-2 border-l border-dotted border-gray-300 ${
                isProductive ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <TrendingUp />
            </button>

            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
              className={`h-full px-2 border-l border-dotted border-gray-300 ${
                isBillable ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <AttachMoney />
            </button>
          </div>
        </div>

        <span className="w-[12.5%] h-full flex justify-center items-center text-base">
          {duration.toFormat("hh:mm:ss")}
        </span>

        <div className="w-[12.5%] h-full flex items-center gap-4">
          {this.props.currentTimer !== null ? (
            <button
              onClick={this.stopTracking}
              className="w-[80%] p-2 bg-gradient-to-br from-red-500 to-red-400 text-white uppercase"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={this.startTracking}
              className="w-[80%] p-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
            >
              Start
            </button>
          )}

          <div className="w-[20%] flex flex-col justify-center items-center">
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
        </div>
      </div>
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

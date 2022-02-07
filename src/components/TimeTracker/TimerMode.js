import React from "react";
import { connect } from "react-redux";

import {
  AttachMoney,
  Close,
  Menu,
  MoneyOffCsred,
  PlayArrow,
  Schedule,
  Stop,
} from "@mui/icons-material";
import { DateTime, Duration } from "luxon";

import { startTimerAsync, stopTimerAsync } from "../../store/slices/timerSlice";
import { addTimerEntryAsync } from "../../store/slices/timerEntrySlice";
import TagSelector from "../Tag/TagSelector";

class TimerMode extends React.Component {
  constructor(props) {
    super(props);

    this.timerID = undefined;

    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.discardTimer = this.discardTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
  }

  componentDidMount() {
    if (this.shouldRestore()) {
      this.restoreTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidUpdate() {
    if (this.shouldRestore()) {
      this.restoreTimer();
    }
  }

  timerExists() {
    return this.timerID !== undefined;
  }

  startTracking(e) {
    const timer = {
      ...this.props.timerEntry,
      startTime: DateTime.now(),
    };

    this.props.startTimer(timer);
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

    console.log(this.props.timerEntry);

    const timerEntry = {
      ...this.props.timerEntry,
      endTime: DateTime.now(),
    };

    this.props.stopTimer(this.props.timer);
    this.props.createTimerEntry(timerEntry);

    this.props.resetState();
  }

  discardTimer(e) {
    this.resetTimer();

    this.props.stopTimer(this.props.timer);
    this.props.resetState();
  }

  shouldRestore() {
    return this.props.timer !== null && !this.timerExists();
  }

  restoreTimer() {
    const { timer } = this.props;

    if (timer === null) {
      console.error("Tried to restore a timer that did not exist");
      return;
    }

    this.timerID = setInterval(this.updateTimer, 1000);
    const { id, ...timerData } = timer;

    this.props.updateState({
      timerEntry: {
        ...timerData,
        duration: DateTime.now().diff(timer.startTime),
      },
    });
  }

  resetTimer() {
    clearInterval(this.timerID);
    this.timerID = undefined;
  }

  render() {
    const { task, isBillable, tag, duration } = this.props.timerEntry;

    return (
      <div className="w-full h-[75px] flex items-center p-4 shadow-md border border-gray-200 text-sm">
        <div className="flex-grow h-full flex items-center">
          <input
            name="task"
            type="text"
            className="flex-grow p-2 border border-gray-300 focus:outline-none"
            value={task}
            placeholder="What are you doing?"
            autoComplete="off"
            onChange={this.props.onTaskChanged}
          />

          <div className="w-[150px] mx-4 flex justify-center items-center">
            <TagSelector
              className="max-w-[125px] h-full flex justify-center items-center"
              value={tag}
              onChange={this.props.onTagSelected}
            />
          </div>

          <button
            title="Is Billable?"
            onClick={this.props.onBillableChanged}
            className={`h-full px-2 mr-4 border-x border-gray-300 text-gray-500`}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>
        </div>

        <span className="w-[135px] h-full mr-4 flex justify-center items-center text-base">
          {duration.toFormat("hh:mm:ss")}
        </span>

        <div className="h-full flex items-center gap-2">
          {this.props.timer !== null ? (
            <button
              onClick={this.stopTracking}
              className="p-2 bg-gradient-to-br from-red-500 to-red-400 rounded-[50%] text-white uppercase"
            >
              <Stop />
            </button>
          ) : (
            <button
              onClick={this.startTracking}
              className="p-2 bg-gradient-to-br from-blue-500 to-blue-400 rounded-[50%] text-white uppercase"
            >
              <PlayArrow />
            </button>
          )}

          <div className="flex flex-col justify-center items-center">
            {this.props.timer !== null ? (
              <button title="Discard Timer" onClick={this.discardTimer}>
                <Close fontSize="small" />
              </button>
            ) : (
              <>
                <button
                  title="Timer Mode"
                  onClick={() => {
                    this.props.resetState();
                    this.props.onSwitchTimerMode();
                  }}
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
                  onClick={() => {
                    this.props.resetState();
                    this.props.onSwitchManualMode();
                  }}
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
    timer: state.timerReducer.timer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTimer: (timer) => {
      dispatch(startTimerAsync(timer));
    },

    stopTimer: (timer) => {
      dispatch(stopTimerAsync(timer));
    },

    createTimerEntry: (timerEntry) => {
      dispatch(addTimerEntryAsync(timerEntry));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerMode);

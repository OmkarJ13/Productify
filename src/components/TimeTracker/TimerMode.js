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
      <div className="flex w-full flex-wrap justify-center gap-4 border border-gray-200 p-2 shadow-md xs:justify-between xs:gap-2">
        <input
          name="task"
          type="text"
          className="w-full border border-gray-300 p-2 focus:outline-none"
          value={task}
          placeholder="What are you doing?"
          autoComplete="off"
          onChange={this.props.onTaskChanged}
        />

        <div className="flex flex-grow items-center justify-center gap-4 xs:flex-grow-0 xs:justify-start">
          <TagSelector
            className="flex max-w-[125px] items-center justify-center"
            value={tag}
            onChange={this.props.onTagSelected}
          />

          <button
            title="Is Billable?"
            onClick={this.props.onBillableChanged}
            className={`border-x border-gray-300 px-2 py-1 text-gray-500`}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>
        </div>

        <div className="flex flex-grow items-center gap-2 xs:flex-grow-0">
          {" "}
          <span className="mx-auto flex w-[135px] items-center justify-center xs:mx-0">
            {duration.toFormat("hh:mm:ss")}
          </span>
          <div className="flex items-center gap-2">
            {this.props.timer !== null ? (
              <button
                onClick={this.stopTracking}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-red-500 p-2 uppercase text-white"
              >
                <Stop />
              </button>
            ) : (
              <button
                onClick={this.startTracking}
                className="flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-blue-500 p-2 uppercase text-white"
              >
                <PlayArrow />
              </button>
            )}
            <div className="flex flex-col items-center justify-center">
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

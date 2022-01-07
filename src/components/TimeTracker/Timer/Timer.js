import React from "react";

import TimerModeForm from "./TimerModeForm";
import ManualModeForm from "./ManualModeForm";

import { v4 as uuid } from "uuid";
import { Duration } from "luxon";
import { DateTime } from "luxon";
import { connect } from "react-redux";

import { currentTimerActions } from "../../../store/slices/currentTimerSlice";
import { timerEntryActions } from "../../../store/slices/timerEntrySlice";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;

    this.state = {
      trackingMode: "timer",
      timerEntry: {
        task: "",
        date: DateTime.fromObject({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        startTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        endTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        duration: Duration.fromMillis(0),
        isProductive: false,
        isBillable: false,
      },
    };

    this.taskChangeHandler = this.taskChangeHandler.bind(this);
    this.dateChangeHandler = this.dateChangeHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.productiveChangeHandler = this.productiveChangeHandler.bind(this);
    this.billableChangeHandler = this.billableChangeHandler.bind(this);
    this.handleTagClicked = this.handleTagClicked.bind(this);
    this.resetState = this.resetState.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.discardTimer = this.discardTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.switchToTimerMode = this.switchToTimerMode.bind(this);
    this.switchToManualMode = this.switchToManualMode.bind(this);
    this.reloadHandler = this.reloadHandler.bind(this);
    this.saveTimerEntry = this.saveTimerEntry.bind(this);
  }

  render() {
    return (
      <>
        <div className="w-full flex items-center p-4 shadow-md border border-gray-300 text-sm">
          {this.generateTimerForm()}
        </div>
      </>
    );
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
    return this.timerId !== undefined;
  }

  shouldRestore() {
    return this.props.currentTimer !== null && this.timerId === undefined;
  }

  restoreTimer() {
    const { currentTimer } = this.props;

    if (currentTimer === null) {
      console.error("Tried to restore a timer that did not exist");
      return;
    }

    this.timerId = setInterval(this.updateTimer, 1000);

    this.setState({
      timerEntry: {
        ...currentTimer,
        duration: DateTime.now().diff(currentTimer.startTime),
      },
    });
  }

  reloadHandler() {
    if (this.timerExists()) {
      this.resetTimer();
      this.storeCurrentTimer();
    }
  }

  taskChangeHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        [e.target.name]: e.target.value,
      },
    });
  }

  dateChangeHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: DateTime.fromJSDate(new Date(e)),
      },
    });
  }

  saveTimerEntry() {
    const timerEntry = {
      id: uuid(),
      ...this.state.timerEntry,
    };

    this.props.saveTimerEntry(timerEntry);
    this.resetState();
  }

  timeChangeHandler(e) {
    const time = DateTime.fromFormat(e.target.value, "hh:mm");

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: time,
        },
      },
      () => {
        const { startTime, endTime } = this.state.timerEntry;
        const changedDuration = endTime.diff(startTime);

        this.setState({
          timerEntry: {
            ...this.state.timerEntry,
            duration: changedDuration,
          },
        });
      }
    );
  }

  productiveChangeHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        isProductive: !this.state.timerEntry.isProductive,
      },
    });
  }

  billableChangeHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        isBillable: !this.state.timerEntry.isBillable,
      },
    });
  }

  handleTagClicked(e) {
    this.setState({
      creatingTag: true,
    });
  }

  startTracking(e) {
    const timer = {
      ...this.state.timerEntry,
      startTime: DateTime.now(),
    };

    this.props.startTimer(timer);
    this.timerId = setInterval(this.updateTimer, 1000);
  }

  storeCurrentTimer() {
    const { timerEntry } = this.state;

    const timer = {
      ...timerEntry,
    };

    localStorage.setItem("currentTimer", JSON.stringify(timer));
  }

  updateTimer() {
    this.setState((prevState) => {
      const { timerEntry } = prevState;
      const prevDuration = timerEntry.duration;
      const newDuration = prevDuration.plus(Duration.fromMillis(1000));

      return {
        timerEntry: {
          ...this.state.timerEntry,
          duration: newDuration,
        },
      };
    });
  }

  stopTracking(e) {
    this.resetTimer();

    const timerEntry = {
      ...this.state.timerEntry,
      id: uuid(),
      endTime: DateTime.now(),
    };

    this.props.stopTimer(timerEntry);
    this.resetState();

    "currentTimer" in localStorage && localStorage.removeItem("currentTimer");
  }

  discardTimer(e) {
    this.props.discardTimer();

    this.resetTimer();
    this.resetState();
  }

  resetTimer() {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }

  componentWillUnmount() {
    if (this.timerExists()) {
      this.resetTimer();
      this.storeCurrentTimer();
    }

    window.removeEventListener("beforeunload", this.reloadHandler);
  }

  resetState() {
    this.setState({
      timerEntry: {
        task: "",
        date: DateTime.fromObject({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        startTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        endTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        duration: Duration.fromMillis(0),
        isProductive: false,
        isBillable: false,
      },
    });
  }

  generateTimerForm() {
    return this.state.trackingMode === "timer" ? (
      <TimerModeForm
        currentTimer={this.props.currentTimer}
        trackingMode={this.state.trackingMode}
        timerEntry={{
          ...this.state.timerEntry,
        }}
        taskChangeHandler={this.taskChangeHandler}
        productiveChangeHandler={this.productiveChangeHandler}
        billableChangeHandler={this.billableChangeHandler}
        onTagClicked={this.handleTagClicked}
        startTracking={this.startTracking}
        stopTracking={this.stopTracking}
        discardTimer={this.discardTimer}
        switchToManualMode={this.switchToManualMode}
        switchToTimerMode={this.switchToTimerMode}
      />
    ) : (
      <ManualModeForm
        currentTimer={this.props.currentTimer}
        trackingMode={this.state.trackingMode}
        timerEntry={{
          ...this.state.timerEntry,
        }}
        taskChangeHandler={this.taskChangeHandler}
        timeChangeHandler={this.timeChangeHandler}
        dateChangeHandler={this.dateChangeHandler}
        productiveChangeHandler={this.productiveChangeHandler}
        billableChangeHandler={this.billableChangeHandler}
        switchToManualMode={this.switchToManualMode}
        switchToTimerMode={this.switchToTimerMode}
        saveTimerEntry={this.saveTimerEntry}
      />
    );
  }

  switchToManualMode() {
    this.setState({
      trackingMode: "manual",
    });
  }

  switchToTimerMode() {
    this.setState({
      trackingMode: "timer",
    });
  }
}

const mapStateToProps = (state) => {
  return {
    currentTimer: state.currentTimerReducer.currentTimer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTimer: (timer) => {
      dispatch(currentTimerActions.start(timer));
    },
    stopTimer: (timer) => {
      dispatch(currentTimerActions.stop());
      dispatch(timerEntryActions.create(timer));
    },
    discardTimer: () => {
      dispatch(currentTimerActions.stop());
    },
    saveTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.create(timerEntry));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);

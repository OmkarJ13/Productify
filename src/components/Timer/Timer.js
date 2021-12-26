import React from "react";

import TimerModeForm from "./TimerModeForm";
import ManualModeForm from "./ManualModeForm";

import { v4 as uuid } from "uuid";
import { Duration } from "luxon";
import { DateTime } from "luxon";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;

    this.state = {
      isTracking: false,
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
    this.saveTimerEntry = this.saveTimerEntry.bind(this);
    this.resetState = this.resetState.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.discardTimer = this.discardTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.switchToTimerMode = this.switchToTimerMode.bind(this);
    this.switchToManualMode = this.switchToManualMode.bind(this);
    this.reloadHandler = this.reloadHandler.bind(this);
  }

  render() {
    return (
      <div className="w-full flex items-center gap-4 p-4 shadow-md border border-gray-300">
        {this.generateTimerForm()}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.reloadHandler);
  }

  componentDidUpdate() {
    if (this.timerExists()) {
      this.restoreTimer();
    }
  }

  timerExists() {
    return this.props.currentTimer && !this.state.isTracking;
  }

  restoreTimer() {
    const { currentTimer } = this.props;

    if (!currentTimer) {
      console.error("Tried to restore a timer that did not exist");
      return;
    }

    const { timerEntry } = currentTimer;

    console.log("Start Time " + timerEntry.startTime.toFormat("hh:mm:ss"));
    console.log("End Time " + timerEntry.endTime.toFormat("hh:mm:ss"));

    timerEntry.duration = currentTimer.shouldContinue
      ? timerEntry.duration
      : DateTime.now().diff(timerEntry.startTime);

    this.setState(
      {
        isTracking: true,
        timerEntry: {
          ...timerEntry,
          date: currentTimer.shouldContinue
            ? DateTime.fromObject({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
            : timerEntry.date,
          startTime: currentTimer.shouldContinue
            ? DateTime.now()
            : timerEntry.startTime,
          duration: currentTimer.shouldContinue
            ? Duration.fromMillis(0)
            : DateTime.now().diff(timerEntry.startTime),
        },
      },
      () => {
        if (!this.timerId) this.timerId = setInterval(this.updateTimer, 1000);
      }
    );
  }

  reloadHandler() {
    if (this.state.isTracking) {
      this.storeCurrentTimer();
    }
  }

  /*
  Handles changes in task name of the timer entry
  */
  taskChangeHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        [e.target.name]: e.target.value,
      },
    });
  }

  /*
  Handles changes in date of the timer entry
  */
  dateChangeHandler(e) {
    console.log(DateTime.fromJSDate(new Date(e)));
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: DateTime.fromJSDate(new Date(e)),
      },
    });
  }

  /*
  Handles changes in start and end times of the timer entry
  */
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

  /* 
  Starts tracking time
  */
  startTracking(e) {
    this.setState(
      {
        isTracking: true,
        timerEntry: {
          ...this.state.timerEntry,
          startTime: DateTime.now(),
        },
      },
      () => {
        this.timerId = setInterval(this.updateTimer, 1000);
      }
    );
  }

  storeCurrentTimer() {
    const currentTimer = {
      shouldContinue: false,
      timerEntry: {
        ...this.state.timerEntry,
        endTime: DateTime.now(),
      },
    };

    this.props.onTimerInterrupted(currentTimer);
  }

  /*
  Updates the timer by one second
  */
  updateTimer() {
    this.setState((prevState) => {
      const prevDuration = prevState.timerEntry.duration;
      const newDuration = prevDuration.plus(Duration.fromMillis(1000));

      return {
        timerEntry: {
          ...this.state.timerEntry,
          duration: newDuration,
        },
      };
    });
  }

  /*
  Stops tracking time 
  */
  stopTracking(e) {
    clearInterval(this.timerId);
    this.timerId = undefined;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          endTime: DateTime.now(),
        },
      },
      () => {
        this.saveTimerEntry();
      }
    );
  }

  discardTimer(e) {
    clearInterval(this.timerId);
    this.timerId = undefined;

    this.resetState();
  }

  componentWillUnmount() {
    if (this.timerId) clearInterval(this.timerId);

    if (this.state.isTracking) {
      this.storeCurrentTimer();
    }

    window.removeEventListener("beforeunload", this.reloadHandler);
  }

  /* 
  Saves the timer entry
  */
  saveTimerEntry() {
    const timerEntry = {
      id: uuid(),
      ...this.state.timerEntry,
    };

    this.props.onTimerEntryCreated(timerEntry);
    this.resetState();
  }

  /*
  Resets state as it was initially
  */
  resetState() {
    this.setState({
      isTracking: false,
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

  /* 
  Generates timer form based on mode
  */
  generateTimerForm() {
    const { task, duration, isProductive, isBillable } = this.state.timerEntry;

    return this.state.trackingMode === "timer" ? (
      <TimerModeForm
        isTracking={this.state.isTracking}
        trackingMode={this.state.trackingMode}
        timerEntry={{
          task: task,
          duration: duration,
          isProductive: isProductive,
          isBillable: isBillable,
        }}
        taskChangeHandler={this.taskChangeHandler}
        productiveChangeHandler={this.productiveChangeHandler}
        billableChangeHandler={this.billableChangeHandler}
        startTracking={this.startTracking}
        stopTracking={this.stopTracking}
        discardTimer={this.discardTimer}
        switchToManualMode={this.switchToManualMode}
        switchToTimerMode={this.switchToTimerMode}
      />
    ) : (
      <ManualModeForm
        trackingMode={this.state.trackingMode}
        timerEntry={{
          ...this.state.timerEntry,
        }}
        taskChangeHandler={this.taskChangeHandler}
        timeChangeHandler={this.timeChangeHandler}
        dateChangeHandler={this.dateChangeHandler}
        productiveChangeHandler={this.productiveChangeHandler}
        billableChangeHandler={this.billableChangeHandler}
        saveTimerEntry={this.saveTimerEntry}
        switchToManualMode={this.switchToManualMode}
        switchToTimerMode={this.switchToTimerMode}
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

export default Timer;

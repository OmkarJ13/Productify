import React from "react";

import TimerModeForm from "./TimerModeForm";
import ManualModeForm from "./ManualModeForm";

import { v4 as uuid } from "uuid";
import Time from "../../classes/Time";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.secondsPassed = 0;
    this.timerId = undefined;

    this.state = {
      isTracking: false,
      trackingMode: "timer",
      timerEntry: {
        task: "",
        date: new Date().toDateString(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(0, 0, 0),
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
    if (this.timerExists()) {
      this.restoreTimer();
    }

    return (
      <div className="w-full flex items-center gap-4 p-4 shadow-md border border-gray-300">
        {this.generateTimerForm()}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.reloadHandler);
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

    this.secondsPassed = (
      currentTimer.shouldContinue
        ? timerEntry.duration
        : new Time().subtractTime(timerEntry.startTime)
    ).toSeconds();

    this.setState(
      {
        isTracking: true,
        timerEntry: {
          ...timerEntry,
          duration: Time.fromSeconds(this.secondsPassed),
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
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: new Date(e).toDateString(),
      },
    });
  }

  /*
  Handles changes in start and end times of the timer entry
  */
  timeChangeHandler(e) {
    // Gets the type of time that is changes, e.g. starting time or ending time
    const type = this.state.timerEntry[e.target.name];

    // Get hours, minutes by splitting the input string and converting it to numbers
    const timeArrayString = e.target.value.split(":");
    const timeArrayNumber = timeArrayString.map((time) => Number(time));

    // Creates Time object
    const time = new Time(...timeArrayNumber, type.seconds);

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: time,
        },
      },
      () => {
        // After setting state,
        // Updates duration based on changed start or end time
        const { startTime, endTime } = this.state.timerEntry;
        const changedDuration = endTime.subtractTime(startTime);
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
          startTime: new Time(),
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
      },
    };

    this.props.onTimerInterrupted(currentTimer);
  }

  /*
  Updates the timer by one second
  */
  updateTimer() {
    this.secondsPassed++;

    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        duration: Time.fromSeconds(this.secondsPassed),
      },
    });
  }

  /*
  Stops tracking time 
  */
  stopTracking(e) {
    clearInterval(this.timerId);
    this.timerId = undefined;

    this.secondsPassed = 0;
    const { startTime, duration } = this.state.timerEntry;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          endTime: Time.addTime(startTime, duration),
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

    this.secondsPassed = 0;

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
        date: new Date().toDateString(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(0, 0, 0),
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

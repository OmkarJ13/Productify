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
      },
    };

    this.taskChangeHandler = this.taskChangeHandler.bind(this);
    this.dateChangeHandler = this.dateChangeHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.saveTimerEntry = this.saveTimerEntry.bind(this);
    this.resetState = this.resetState.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.switchToTimerMode = this.switchToTimerMode.bind(this);
    this.switchToManualMode = this.switchToManualMode.bind(this);
    this.reloadHandler = this.reloadHandler.bind(this);
  }

  render() {
    const { isTracking } = this.state;

    if (this.timerExists()) {
      console.log("Restoring timer");
      this.restoreTimer();
    }

    return (
      <div className="w-full flex items-center gap-4 p-4 shadow-md">
        {isTracking ? this.generateTimerRunning() : this.generateTimerForm()}
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
        [e.target.name]: new Date(e.target.value).toDateString(),
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
        console.log("Setting timer");
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
    console.log(Time.fromSeconds(this.secondsPassed));

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

    console.log("Stopping timer");

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

  componentWillUnmount() {
    if (this.timerId) clearInterval(this.timerId);
    console.log("Stopping timer");

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
      },
    });
  }

  /*
  Generates timer JSX as it is running
  */
  generateTimerRunning() {
    const { duration } = this.state.timerEntry;
    return (
      <>
        <span className="flex-grow text-lg font-bold">
          {duration.toTimeString()}
        </span>
        <button
          onClick={this.stopTracking}
          className="px-4 py-2 bg-red-500 text-white uppercase"
        >
          Stop Tracking
        </button>
      </>
    );
  }

  /* 
  Generates timer form based on mode
  */
  generateTimerForm() {
    const { task, startTime, endTime, duration, date } = this.state.timerEntry;

    return this.state.trackingMode === "timer" ? (
      <TimerModeForm
        timerEntry={{
          task: task,
        }}
        taskChangeHandler={this.taskChangeHandler}
        startTracking={this.startTracking}
        switchToManualMode={this.switchToManualMode}
        switchToTimerMode={this.switchToTimerMode}
      />
    ) : (
      <ManualModeForm
        timerEntry={{
          task: task,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          date: date,
        }}
        taskChangeHandler={this.taskChangeHandler}
        timeChangeHandler={this.timeChangeHandler}
        dateChangeHandler={this.dateChangeHandler}
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

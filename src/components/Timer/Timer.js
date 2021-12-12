import React from "react";
import "./Timer.css";

import TimerModeForm from "./TimerModeForm";
import ManualModeForm from "./ManualModeForm";

import { v4 as uuid } from "uuid";
import Time from "../../classes/Time";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerComponent = React.createRef();
    this.secondsPassed = 0;

    this.state = {
      isTracking: false,
      trackingMode: "timer",
      timerId: undefined,
      timerEntry: {
        task: "",
        date: new Date().toDateString(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(),
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

  reloadHandler(e) {
    if (this.state.isTracking) {
      this.saveTimer();
    }
  }

  isMounted() {
    return this.timerComponent.current != null;
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.reloadHandler);
    this.checkTimerExists();
  }

  checkTimerExists() {
    const timerState = JSON.parse(localStorage.getItem("timerState"));

    if (timerState) {
      this.restoreTimer(timerState);
    }
  }

  restoreTimer(prevState) {
    const startTime = new Time(
      ...Object.values(prevState.timerEntry.startTime)
    );
    const endTime = new Time(...Object.values(prevState.timerEntry.endTime));
    const duration = new Time(...Object.values(prevState.timerEntry.duration));

    this.secondsPassed = duration.getSeconds();
    clearInterval(prevState.timerId);

    this.setState({
      ...prevState,
      timerId: setInterval(this.updateTimer, 1000),
      timerEntry: {
        ...prevState.timerEntry,
        startTime,
        endTime,
        duration,
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
        date: new Date(e.target.value).toDateString(),
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
    this.setState({
      isTracking: true,
      timerId: setInterval(this.updateTimer, 1000),
      timerEntry: {
        ...this.state.timerEntry,
        startTime: Time.getCurrentTime(),
      },
    });
  }

  /*
  Updates the timer by one second
  */
  updateTimer() {
    this.secondsPassed++;

    if (this.isMounted()) {
      this.setState({
        timerEntry: {
          ...this.state.timerEntry,
          duration: Time.fromSeconds(this.secondsPassed),
        },
      });
    } else {
      const timerState = JSON.parse(localStorage.getItem("timerState"));
      timerState.timerEntry.duration = Time.fromSeconds(this.secondsPassed);
      localStorage.setItem("timerState", JSON.stringify(timerState));
    }
  }

  /*
  Stops tracking time 
  */
  stopTracking(e) {
    clearInterval(this.state.timerId);

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
    this.setState(
      {
        isTracking: false,
        timerId: undefined,
        timerEntry: {
          task: "",
          date: new Date().toDateString(),
          startTime: new Time(),
          endTime: new Time(),
          duration: new Time(),
        },
      },
      () => {
        localStorage.removeItem("timerState");
      }
    );
  }

  /*
  Generates timer JSX as it is running
  */
  generateTimerRunning() {
    const { duration } = this.state.timerEntry;
    return (
      <>
        <span className="Timer__duration">{duration.getTimeString()}</span>
        <button onClick={this.stopTracking} className="Timer__stop-btn">
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

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.reloadHandler);

    if (this.state.isTracking) {
      this.saveTimer();
    }
  }

  saveTimer() {
    const timerState = {
      ...this.state,
    };

    localStorage.setItem("timerState", JSON.stringify(timerState));
  }

  render() {
    const { isTracking } = this.state;

    return (
      <div className="Timer flex" ref={this.timerComponent}>
        {isTracking ? this.generateTimerRunning() : this.generateTimerForm()}
      </div>
    );
  }
}

export default Timer;

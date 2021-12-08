import React from "react";
import "./Timer.css";

import { v4 as uuid } from "uuid";
import Time from "../classes/Time";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;
    this.secondsPassed = 0;

    this.state = {
      isTracking: false,
      trackingMode: "timer",
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
    this.setState(
      {
        isTracking: true,
        timerEntry: {
          ...this.state.timerEntry,
          startTime: Time.getCurrentTime(),
        },
      },
      () => {
        this.timerId = setInterval(this.updateTimer, 1000);
      }
    );
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
    this.secondsPassed = 0;

    const { startTime, duration } = this.state.timerEntry;

    this.setState(
      {
        isTracking: false,

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
    this.setState({
      tracking: false,
      timerEntry: {
        task: "",
        date: new Date().toDateString(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(),
      },
    });
  }

  /*
  Generates timer JSX as it is running
  */
  generateTimerRunning() {
    const { duration } = this.state.timerEntry;
    return (
      <div className="Timer">
        <span className="Timer__duration">{duration.getTimeString()}</span>
        <button onClick={this.stopTracking} className="Timer__stop-btn">
          Stop Tracking
        </button>
      </div>
    );
  }

  /*
  Generates timer mode form JSX
  */
  generateTimerModeForm() {
    const { task } = this.state.timerEntry;

    return (
      <div className="Timer">
        <input
          name="task"
          type="text"
          className="Timer__task-input"
          value={task}
          placeholder="What are you working on?"
          autoComplete="off"
          onChange={this.taskChangeHandler}
        />

        <button onClick={this.startTracking} className="Timer__start-btn">
          Start Tracking
        </button>
        <div className="Timer__modes">
          <button
            onClick={this.switchToTimerMode}
            className="Timer__timer-mode-btn"
          >
            <i className="fa fa-clock-o" />
          </button>
          <button
            onClick={this.switchToManualMode}
            className="Timer__manual-mode-btn"
          >
            <i className="fa fa-bars" />
          </button>
        </div>
      </div>
    );
  }

  getDateString(date) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /*
  Generates manual mode JSX
  */
  generateManualModeForm() {
    const { task, date, startTime, endTime, duration } = this.state.timerEntry;
    const dateValue = this.getDateString(new Date(date));

    return (
      <div className="Timer">
        <input
          name="task"
          type="text"
          className="Timer__task-input"
          value={task}
          placeholder="What have you worked on?"
          autoComplete="off"
          onChange={this.taskChangeHandler}
        />

        <div className="Timer__time-input-container">
          <input
            name="startTime"
            type="time"
            value={startTime.getTimeStringShort()}
            onChange={this.timeChangeHandler}
            className="Timer__start-time-input"
          />
          <span> - </span>
          <input
            name="endTime"
            type="time"
            value={endTime.getTimeStringShort()}
            onChange={this.timeChangeHandler}
            className="Timer__end-time-input"
          />
        </div>

        <div className="Timer__duration">
          <span>{duration.getTimeString()}</span>
        </div>

        <input
          type="date"
          value={dateValue}
          onChange={this.dateChangeHandler}
          className="Timer__date-input"
        />

        <button onClick={this.saveTimerEntry} className="Timer__add-btn">
          Add
        </button>

        <div className="Timer__modes">
          <button
            onClick={this.switchToTimerMode}
            className="Timer__timer-mode-btn"
          >
            <i className="fa fa-clock-o" />
          </button>
          <button
            onClick={this.switchToManualMode}
            className="Timer__manual-mode-btn"
          >
            <i className="fa fa-bars" />
          </button>
        </div>
      </div>
    );
  }

  /* 
  Generates timer form based on mode
  */
  generateTimerForm() {
    return this.state.trackingMode === "timer"
      ? this.generateTimerModeForm()
      : this.generateManualModeForm();
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

  render() {
    const { isTracking } = this.state;
    return isTracking ? this.generateTimerRunning() : this.generateTimerForm();
  }
}

export default Timer;

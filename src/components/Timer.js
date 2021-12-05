import React from "react";
import "./Timer.css";

import { v4 as uuid } from "uuid";
import Time from "../classes/Time";
import ReactDatePicker from "react-datepicker";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;
    this.startTime = undefined;
    this.secondsPassed = 0;

    this.state = {
      tracking: false,
      mode: "timer",
      timerEntry: {
        task: "",
        date: new Date(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(),
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.saveTimerEntry = this.saveTimerEntry.bind(this);
    this.resetState = this.resetState.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.switchToTimerMode = this.switchToTimerMode.bind(this);
    this.switchToManualMode = this.switchToManualMode.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        [e.target.name]: e.target.value,
      },
    });
  }

  handleDateChange(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: new Date(e),
      },
    });
  }

  handleTimeChange(e) {
    const type = this.state.timerEntry[e.target.name];
    const time = new Time(
      ...e.target.value.split(":").map((time) => Number(time)),
      type.seconds
    );

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: time,
        },
      },
      () => {
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

  startTracking(e) {
    const curDate = new Date();
    this.startTime = new Time(
      curDate.getHours(),
      curDate.getMinutes(),
      curDate.getSeconds()
    );

    this.setState(
      {
        tracking: true,
      },
      () => {
        this.timerId = setInterval(this.startTimer, 1000);
      }
    );
  }

  startTimer() {
    this.secondsPassed++;

    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        duration: Time.fromSeconds(this.secondsPassed),
      },
    });
  }

  stopTracking(e) {
    clearInterval(this.timerId);
    this.secondsPassed = 0;

    const endTime = this.state.timerEntry.startTime.addTime(
      this.state.timerEntry.duration
    );

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          endTime: endTime,
        },
      },
      () => {
        this.saveTimerEntry();
      }
    );
  }

  saveTimerEntry() {
    const timerEntry = {
      id: uuid(),
      ...this.state.timerEntry,
    };

    this.props.onTimerEntryCreated(timerEntry);
    this.resetState();
  }

  resetState() {
    this.setState({
      tracking: false,
      timerEntry: {
        task: "",
        date: new Date(),
        startTime: new Time(),
        endTime: new Time(),
        duration: new Time(),
      },
    });
  }

  generateTimerRunning() {
    const { duration } = this.state.timerEntry;
    return (
      <>
        <span className="Timer__time">{duration.getTimeString()}</span>
        <button onClick={this.stopTracking} className="Timer__stop-btn">
          Stop Tracking
        </button>
      </>
    );
  }

  generateTimerModeForm() {
    const { task } = this.state.timerEntry;

    return (
      <>
        <div className="Timer__controls">
          <input
            name="task"
            type="text"
            className="Timer__task-input"
            value={task}
            placeholder="What are you working on?"
            autoComplete="off"
            onChange={this.handleInputChange}
          />
        </div>

        <div className="Timer__actions">
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
      </>
    );
  }

  generateManualModeForm() {
    const { task, date, startTime, endTime, duration } = this.state.timerEntry;

    return (
      <>
        <div className="Timer__controls">
          <input
            name="task"
            type="text"
            className="Timer__task-input"
            value={task}
            placeholder="What have you worked on?"
            autoComplete="off"
            onChange={this.handleInputChange}
          />

          <div className="Timer__time-input">
            <input
              name="startTime"
              type="time"
              value={startTime.getTimeString()}
              onChange={this.handleTimeChange}
            />
            <span> - </span>
            <input
              name="endTime"
              type="time"
              value={endTime.getTimeString()}
              onChange={this.handleTimeChange}
            />
          </div>

          <ReactDatePicker
            selected={date}
            value={date}
            customInput={<i className="fa fa-calendar" />}
            className="Timer__date-input"
            onChange={this.handleDateChange}
          />
        </div>

        <div className="Timer__duration">
          <span>{duration.getTimeString()}</span>
        </div>

        <div className="Timer__actions">
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
      </>
    );
  }

  generateTimerForm() {
    return this.state.mode === "timer"
      ? this.generateTimerModeForm()
      : this.generateManualModeForm();
  }

  switchToManualMode() {
    this.setState({
      mode: "manual",
    });
  }

  switchToTimerMode() {
    this.setState({
      mode: "timer",
    });
  }

  render() {
    const { tracking } = this.state;

    return (
      <div className="Timer">
        {tracking ? this.generateTimerRunning() : this.generateTimerForm()}
      </div>
    );
  }
}

export default Timer;

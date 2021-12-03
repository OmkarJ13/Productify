import React from "react";
import "./Timer.css";
import { v4 as uuid } from "uuid";
import { startInterval } from "../helpers/timerHelpers";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;
    this.secondsPassed = 0;

    this.state = {
      tracking: false,
      taskName: "",
      timePassed: { hours: "00", minutes: "00", seconds: "00" },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  startTracking(e) {
    this.secondsPassed = 0;

    this.setState(
      {
        tracking: true,
        timePassed: this.generateTime(this.secondsPassed),
      },
      () => {
        this.timerId = startInterval(this.startTimer, 1000);
      }
    );
  }

  startTimer() {
    this.secondsPassed++;
    this.setState({
      timePassed: this.generateTime(this.secondsPassed),
    });
  }

  stopTracking(e) {
    clearInterval(this.timerId);

    const timerEntry = {
      id: uuid(),
      taskName: this.state.taskName,
      time: this.state.timePassed,
      date: new Date(),
    };

    this.props.onTimerEntryCreated(timerEntry);

    this.setState({
      tracking: false,
      taskName: "",
    });
  }

  generateTime(seconds) {
    const hour = 3600;
    const minute = 60;

    const hoursPassed = Math.floor(seconds / hour);
    const minutesPassed = Math.floor((seconds % hour) / minute);
    const secondsPassed = seconds % minute;

    return {
      hours: String(hoursPassed).padStart(2, "0"),
      minutes: String(minutesPassed).padStart(2, "0"),
      seconds: String(secondsPassed).padStart(2, "0"),
    };
  }

  generateTimerRunning() {
    const { hours, minutes, seconds } = this.state.timePassed;

    return (
      <>
        <span className="Timer__time">
          {hours}:{minutes}:{seconds}
        </span>
        <button onClick={this.stopTracking} className="Timer__stop-btn">
          Stop Tracking
        </button>
      </>
    );
  }

  generateTimerForm() {
    return (
      <>
        <input
          name="taskName"
          type="text"
          className="Timer__task-input"
          value={this.state.taskName}
          placeholder="What are you working on?"
          onChange={this.handleInputChange}
        />
        <button onClick={this.startTracking} className="Timer__start-btn">
          Start Tracking
        </button>
      </>
    );
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

import React from "react";
import "./Timer.css";

import { v4 as uuid } from "uuid";
import { startInterval } from "../helpers/timerHelpers";
import Time from "../classes/Time";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;
    this.startTime = undefined;
    this.secondsPassed = 0;

    this.state = {
      tracking: false,
      task: "",
      duration: undefined,
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
    const curDate = new Date();
    this.startTime = new Time(
      curDate.getHours(),
      curDate.getMinutes(),
      curDate.getSeconds()
    );

    this.setState(
      {
        tracking: true,
        duration: new Time(),
      },
      () => {
        this.timerId = setInterval(this.startTimer, 1000);
      }
    );
  }

  startTimer() {
    this.secondsPassed++;
    console.log(Time.fromSeconds(this.secondsPassed).getTimeString());

    this.setState({
      duration: Time.fromSeconds(this.secondsPassed),
    });
  }

  stopTracking(e) {
    clearInterval(this.timerId);
    const endTime = this.startTime.addTime(this.state.duration);

    const timerEntry = {
      id: uuid(),
      task: this.state.task,
      duration: this.state.duration,
      date: new Date(),
      startTime: this.startTime,
      endTime: endTime,
    };

    this.secondsPassed = 0;
    this.setState({
      tracking: false,
      taskName: "",
    });

    this.props.onTimerEntryCreated(timerEntry);
  }

  generateTimerRunning() {
    return (
      <>
        <span className="Timer__time">
          {this.state.duration.getTimeString()}
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
          name="task"
          type="text"
          className="Timer__task-input"
          value={this.state.taskName}
          placeholder="What are you working on?"
          autoComplete="off"
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

import React from "react";
import "./TimerEntry.css";

import { calculateDaysPassed, days } from "../helpers/timerHelpers";
import Time from "../classes/Time";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);
    this.editTimer = undefined;

    this.state = {
      task: this.props.task,
      date: new Date(this.props.date),
      startTime: new Time(...Object.values(this.props.startTime)),
      endTime: new Time(...Object.values(this.props.endTime)),
      duration: new Time(...Object.values(this.props.duration)),
    };

    this.textEditHandler = this.textEditHandler.bind(this);
    this.timeEditHandler = this.timeEditHandler.bind(this);
    this.dateEditHandler = this.dateEditHandler.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  textEditHandler(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    this.setSaveTimer();
  }

  timeEditHandler(e) {
    const type = this.state[e.target.name];
    const time = new Time(...e.target.value.split(":"), type.seconds);

    this.setState(
      {
        [e.target.name]: time,
      },
      () => {
        const changedDuration = this.state.endTime.subtractTime(
          this.state.startTime
        );
        this.setState({
          duration: changedDuration,
        });
      }
    );

    this.setSaveTimer();
  }

  dateEditHandler(e) {
    this.setState({
      date: new Date(e),
    });

    this.setSaveTimer();
  }

  setSaveTimer() {
    if (this.editTimer !== undefined) {
      clearTimeout(this.editTimer);
    }

    this.editTimer = setTimeout(() => {
      this.saveEditedChanges();
    }, 1000);
  }

  saveEditedChanges() {
    const editedTimerEntry = {
      id: this.props.id,
      ...this.state,
    };

    console.log(editedTimerEntry);

    this.props.onTimerEntryEdited(editedTimerEntry);
  }

  handleDelete(e) {
    this.props.onTimerEntryDeleted(this.props.id);
  }

  getDateString() {
    const { date } = this.state;
    const dayString = (date.getDay() + 1).toString().padStart(2, "0");
    const monthString = (date.getMonth() + 1).toString().padStart(2, "0");
    const yearString = date.getFullYear().toString();

    return `${dayString}/${monthString}/${yearString}`;
  }

  generateTimerEntry() {
    let daysSince = calculateDaysPassed(this.state.date);
    const { startTime, endTime, duration } = this.state;

    return (
      <div className="TimerEntry">
        <div className="TimerEntry__date">
          <span>
            {days[daysSince] === undefined
              ? this.getDateString()
              : days[daysSince]}
          </span>
          <div className="TimerEntry__date-change">
            <ReactDatePicker
              value={this.state.date}
              selected={this.state.date}
              onChange={this.dateEditHandler}
              customInput={<i className="fa fa-calendar" />}
            />
          </div>
        </div>
        <div className="TimerEntry__content">
          <input
            type="text"
            name="task"
            value={this.state.task}
            placeholder="Add Task Name"
            onChange={this.textEditHandler}
            className="TimerEntry__task-input"
          />

          <div className="TimerEntry__time">
            <div className="TimerEntry__start-time">
              <input
                type="time"
                name="startTime"
                value={
                  startTime.getHourString() + ":" + startTime.getMinuteString()
                }
                onChange={this.timeEditHandler}
              />
            </div>
            <span>-</span>
            <div className="TimerEntry__end-time">
              <input
                type="time"
                name="endTime"
                value={
                  endTime.getHourString() + ":" + endTime.getMinuteString()
                }
                onChange={this.timeEditHandler}
              />
            </div>
          </div>

          <div className="TimerEntry__duration">
            <span>{duration.getTimeString()}</span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.generateTimerEntry();
  }
}

export default TimerEntry;

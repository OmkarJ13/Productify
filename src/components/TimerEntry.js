import React from "react";
import "./TimerEntry.css";

import { calculateDaysPassed, days } from "../helpers/timerHelpers";
import Time from "../classes/Time";

import { v4 as uuid } from "uuid";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);
    this.editTimer = undefined;
    this.dropDownContainer = React.createRef();

    this.state = {
      isEditing: false,
      timerEntry: {
        task: this.props.task,
        date: new Date(this.props.date),
        startTime: new Time(...Object.values(this.props.startTime)),
        endTime: new Time(...Object.values(this.props.endTime)),
        duration: new Time(...Object.values(this.props.duration)),
      },
    };

    this.textEditHandler = this.textEditHandler.bind(this);
    this.timeEditHandler = this.timeEditHandler.bind(this);
    this.dateEditHandler = this.dateEditHandler.bind(this);
    this.openEditOptions = this.openEditOptions.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.duplicateEntry = this.duplicateEntry.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    if (!this.dropDownContainer.current.contains(e.target)) {
      if (this.state.isEditing) {
        this.setState({ isEditing: false });
      }
    }
  }

  textEditHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        [e.target.name]: e.target.value,
      },
    });

    this.setSaveTimer();
  }

  timeEditHandler(e) {
    const type = this.state.timerEntry[e.target.name];
    const time = new Time(...e.target.value.split(":"), type.seconds);

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

    this.setSaveTimer();
  }

  dateEditHandler(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: new Date(e),
      },
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
      ...this.state.timerEntry,
    };

    this.props.onTimerEntryEdited(editedTimerEntry);
  }

  getDateString() {
    const { date } = this.state.timerEntry;
    const dayString = (date.getDay() + 1).toString().padStart(2, "0");
    const monthString = (date.getMonth() + 1).toString().padStart(2, "0");
    const yearString = date.getFullYear().toString();

    return `${dayString}/${monthString}/${yearString}`;
  }

  openEditOptions(e) {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  }

  duplicateEntry(e) {
    const duplicatedEntry = {
      id: uuid(),
      ...this.state.timerEntry,
    };

    this.props.onTimerEntryDuplicated(duplicatedEntry);

    this.setState({
      isEditing: false,
    });
  }

  deleteEntry(e) {
    this.props.onTimerEntryDeleted(this.props.id);
    this.setState({
      isEditing: false,
    });
  }

  generateTimerEntry() {
    const { task, date, startTime, endTime, duration } = this.state.timerEntry;
    let daysSince = calculateDaysPassed(date);

    return (
      <div className="TimerEntry">
        <div className="TimerEntry__top">
          <div className="TimerEntry__date">
            <span>
              {days[daysSince] === undefined
                ? this.getDateString()
                : days[daysSince]}
            </span>
          </div>

          <div className="TimerEntry__top-options">
            <ReactDatePicker
              value={date}
              selected={date}
              onChange={this.dateEditHandler}
              customInput={<i className="fa fa-calendar" />}
            />

            <div className="TimerEntry__dropdown" ref={this.dropDownContainer}>
              <button
                onClick={this.openEditOptions}
                className="TimerEntry__dropdown-btn"
              >
                <i className="fa fa-ellipsis-v" />
              </button>
              {this.state.isEditing && (
                <div className="TimerEntry__dropdown-options">
                  <ul>
                    <li className="TimerEntry__dropdown-item">
                      <button onClick={this.duplicateEntry}>Duplicate</button>
                    </li>
                    <li className="TimerEntry__dropdown-item">
                      <button onClick={this.deleteEntry}>Delete</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="TimerEntry__content">
          <input
            type="text"
            name="task"
            value={task}
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

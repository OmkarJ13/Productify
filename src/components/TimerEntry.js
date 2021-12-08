import React from "react";
import "./TimerEntry.css";
import Time from "../classes/Time";

import { v4 as uuid } from "uuid";
import "react-datepicker/dist/react-datepicker.css";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);

    this.saveTimerID = undefined;
    this.dropdownOptionsDiv = React.createRef();

    this.state = {
      isDropdownOpen: false,
      showAllEntries: false,
      timerEntry: {
        task: this.props.task,
        date: this.props.date,
        startTime: new Time(...Object.values(this.props.startTime)),
        endTime: new Time(...Object.values(this.props.endTime)),
        duration: new Time(...Object.values(this.props.duration)),
      },
    };

    this.taskChangeHandler = this.taskChangeHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.dateChangeHandler = this.dateChangeHandler.bind(this);
    this.documentClickHandler = this.documentClickHandler.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleAllEntries = this.toggleAllEntries.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.duplicateEntry = this.duplicateEntry.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.documentClickHandler);
  }

  /* 
  Handles click events on the whole document
  */
  documentClickHandler(e) {
    if (!this.dropdownOptionsDiv.current.contains(e.target)) {
      if (this.state.isDropdownOpen) {
        this.setState({ isDropdownOpen: false });
      }
    }
  }

  /*
  Handles changes in task name of the timer entry
  */
  taskChangeHandler(e) {
    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: e.target.value,
        },
      },
      () => {
        this.setSaveTimer();
      }
    );
  }

  /* 
  Handles the changes made in start and end time of the timer entry
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
        this.setState(
          {
            timerEntry: {
              ...this.state.timerEntry,
              duration: changedDuration,
            },
          },
          () => {
            this.saveEditedChanges();
          }
        );
      }
    );
  }

  /*
  Handles changes made in the date of the timer entry
  */
  dateChangeHandler(e) {
    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          date: new Date(e.target.value).toDateString(),
        },
      },
      () => {
        this.saveEditedChanges();
      }
    );
  }

  /*
    Sets a timer to save the unsaved changes made by the user
    Changes get saved after 1 second.
    However, if called when a timer is active, resets that timer and sets a new one
  */
  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 1000);
  }

  /*
  Saves the changes made by the user
  */
  saveEditedChanges() {
    const { id, onTimerEntryEdited } = this.props;

    const editedTimerEntry = {
      id,
      ...this.state.timerEntry,
    };

    onTimerEntryEdited(editedTimerEntry);
  }

  /* 
  Toggles dropdown menu
  */
  toggleDropdown(e) {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  }

  /* 
  Duplicates the entry, if this entry is a combined entry, duplicates all the entries
  */
  duplicateEntry(e) {
    const { allEntries, onTimerEntryDuplicated } = this.props;

    if (allEntries) {
      allEntries.forEach((entry) => {
        const duplicatedEntry = {
          id: uuid(),
          ...entry,
        };

        onTimerEntryDuplicated(duplicatedEntry);
      });
    } else {
      const duplicatedEntry = {
        id: uuid(),
        ...this.state.timerEntry,
      };

      onTimerEntryDuplicated(duplicatedEntry);
    }

    // Closes the dropdown menu after duplication
    this.setState({
      isDropdownOpen: false,
    });
  }

  /*
  Deletes the entry, if this entry is a combined entry, deletes all the entries
  */
  deleteEntry(e) {
    const { id, allEntries, onTimerEntryDeleted } = this.props;

    if (allEntries) {
      allEntries.forEach((entry) => onTimerEntryDeleted(entry.props.id));
    } else {
      onTimerEntryDeleted(id);
    }

    // Closes the dropdown menu after deletion
    this.setState({
      isDropdownOpen: false,
    });
  }

  /*
  Toggles dropdown menu
  */
  toggleAllEntries(e) {
    this.setState({
      showAllEntries: !this.state.showAllEntries,
    });
  }

  getDateString(date) {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  generateTimerEntry() {
    const isCombined = this.props.allEntries !== undefined;

    const { isDropdownOpen, showAllEntries } = this.state;
    const { task, date, startTime, endTime, duration } = this.state.timerEntry;

    const dateValue = this.getDateString(new Date(date));

    return (
      <>
        <div
          className="TimerEntry"
          onClick={isCombined && this.toggleAllEntries}
        >
          <div className="TimerEntry__content">
            {isCombined && (
              <div className="TimerEntry__duplicates">
                {this.props.allEntries.length}
              </div>
            )}

            <input
              type="text"
              name="task"
              value={task}
              placeholder="Add Task Name"
              readOnly={isCombined}
              autoComplete="off"
              onChange={this.taskChangeHandler}
              className="TimerEntry__task-input"
            />

            <div className="TimerEntry__time">
              <div className="TimerEntry__start-time">
                <input
                  type="time"
                  name="startTime"
                  readOnly={isCombined}
                  value={startTime.getTimeStringShort()}
                  onChange={this.timeChangeHandler}
                />
              </div>
              <span>-</span>
              <div className="TimerEntry__end-time">
                <input
                  type="time"
                  name="endTime"
                  readOnly={isCombined}
                  value={endTime.getTimeStringShort()}
                  onChange={this.timeChangeHandler}
                />
              </div>
            </div>

            <div className="TimerEntry__duration">
              <span>{duration.getTimeString()}</span>
            </div>

            <input
              type="date"
              value={dateValue}
              onChange={this.dateChangeHandler}
              readOnly={isCombined}
              className="TimerEntry__date-input"
            />

            <div className="TimerEntry__dropdown" ref={this.dropdownOptionsDiv}>
              <button
                onClick={this.toggleDropdown}
                className="TimerEntry__dropdown-btn"
              >
                <i className="fa fa-ellipsis-v" />
              </button>

              {isDropdownOpen && (
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
        {showAllEntries && this.props.allEntries}
      </>
    );
  }

  render() {
    return this.generateTimerEntry();
  }
}

export default TimerEntry;

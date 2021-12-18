import React from "react";

import Time from "../../classes/Time";
import { v4 as uuid } from "uuid";
import ReactDatePicker from "react-datepicker";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);

    this.saveTimerID = undefined;
    this.taskInput = React.createRef();
    this.dropdownBtn = React.createRef();
    this.dropdownOptionsDiv = React.createRef();

    this.state = {
      isDropdownOpen: false,
      showAllEntries: false,
      timerEntry: {
        task: this.props.task,
        date: this.props.date,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        duration: this.props.duration,
        isProductive: this.props.isProductive,
        isBillable: this.props.isBillable,
      },
    };

    this.taskChangeHandler = this.taskChangeHandler.bind(this);
    this.timeChangeHandler = this.timeChangeHandler.bind(this);
    this.dateChangeHandler = this.dateChangeHandler.bind(this);
    this.productiveChangeHandler = this.productiveChangeHandler.bind(this);
    this.billableChangeHandler = this.billableChangeHandler.bind(this);
    this.documentClickHandler = this.documentClickHandler.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleAllEntries = this.toggleAllEntries.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.duplicateEntry = this.duplicateEntry.bind(this);
    this.continueTimerEntry = this.continueTimerEntry.bind(this);
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
          date: new Date(e).toDateString(),
        },
      },
      () => {
        this.saveEditedChanges();
      }
    );
  }

  productiveChangeHandler(e) {
    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          isProductive: !this.state.timerEntry.isProductive,
        },
      },
      () => {
        this.saveEditedChanges();
      }
    );
  }

  billableChangeHandler(e) {
    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          isBillable: !this.state.timerEntry.isBillable,
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
    this.taskInput.current.blur();
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
        const {
          task,
          date,
          startTime,
          endTime,
          duration,
          isProductive,
          isBillable,
        } = entry.props;
        const duplicatedEntry = {
          id: uuid(),
          task,
          date,
          startTime,
          endTime,
          duration,
          isProductive,
          isBillable,
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
    if (!this.dropdownBtn.current.contains(e.target)) {
      this.setState({
        showAllEntries: !this.state.showAllEntries,
      });
    }
  }

  continueTimerEntry(e) {
    const currentTimer = {
      shouldContinue: true,
      timerEntry: {
        ...this.state.timerEntry,
        startTime: new Time(),
        duration: new Time(0, 0, 0),
        date: new Date().toDateString(),
      },
    };

    this.props.onTimerEntryContinued(currentTimer);
  }

  generateTimerEntry() {
    const isCombined = this.props.allEntries !== undefined;

    const { isDropdownOpen, showAllEntries } = this.state;
    const {
      task,
      date,
      startTime,
      endTime,
      duration,
      isProductive,
      isBillable,
    } = this.state.timerEntry;

    const dateValue = new Date(date);

    return (
      <>
        <div
          className="group w-full flex items-center gap-4 p-4 border-x border-b border-gray-300 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="w-1/3 flex items-center gap-4">
            {isCombined && (
              <div className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-[50%]">
                {this.props.allEntries.length}
              </div>
            )}
            <input
              type="text"
              name="task"
              value={task}
              placeholder="Add Task Name"
              ref={this.taskInput}
              readOnly={isCombined}
              autoComplete="off"
              onChange={this.taskChangeHandler}
              className="transition-colors flex-grow p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
          </div>

          <div className="transition-opacity flex items-center opacity-0 group-hover:opacity-100">
            <button onClick={this.productiveChangeHandler} className="px-4">
              <i
                className={`fa fa-line-chart ${
                  isProductive && "text-blue-500 font-bold"
                }`}
              />
            </button>
            <button onClick={this.billableChangeHandler} className="px-4">
              <i
                className={`fa fa-dollar ${
                  isBillable && "text-blue-500 font-bold"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="time"
              name="startTime"
              readOnly={isCombined}
              value={startTime.toTimeStringShort()}
              onChange={this.timeChangeHandler}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
            <span>-</span>
            <input
              type="time"
              name="endTime"
              readOnly={isCombined}
              value={endTime.toTimeStringShort()}
              onChange={this.timeChangeHandler}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex-grow text-center text-black border-x border-gray-300">
            <span>{duration.toTimeString()}</span>
          </div>

          <div className="transition-opacity inline-block w-fit opacity-0 group-hover:opacity-100">
            <ReactDatePicker
              selected={dateValue}
              name="date"
              onChange={this.dateChangeHandler}
              readOnly={isCombined}
              className="p-1"
              customInput={<i className="fa fa-calendar" />}
            />
          </div>

          <button
            onClick={this.continueTimerEntry}
            className="transition-opacity p-1 text-gray-600 opacity-0 group-hover:opacity-100"
          >
            <i className="fa fa-play" />
          </button>

          <div className="relative" ref={this.dropdownOptionsDiv}>
            <button
              onClick={this.toggleDropdown}
              ref={this.dropdownBtn}
              className="p-1 text-gray-600"
            >
              <i className="fa fa-ellipsis-v" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-8 right-0 z-10 shadow-xl">
                <ul>
                  <li>
                    <button
                      onClick={this.duplicateEntry}
                      className="w-full px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                    >
                      Duplicate
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={this.deleteEntry}
                      className="w-full px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
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

import React from "react";

import { v4 as uuid } from "uuid";
import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";

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

  documentClickHandler(e) {
    if (!this.dropdownOptionsDiv.current.contains(e.target)) {
      if (this.state.isDropdownOpen) {
        this.setState({ isDropdownOpen: false });
      }
    }
  }

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

  timeChangeHandler(e) {
    const time = DateTime.fromFormat(e.target.value, "hh:mm");

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: time,
        },
      },
      () => {
        const { startTime, endTime } = this.state.timerEntry;

        const zeroedStartTime = startTime.set({ second: 0, millisecond: 0 });
        const zeroedEndTime = endTime.set({ second: 0, millisecond: 0 });

        const changedDuration = zeroedEndTime.diff(zeroedStartTime);

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

  dateChangeHandler(e) {
    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          date: DateTime.fromJSDate(new Date(e)),
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

  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 1000);
  }

  saveEditedChanges() {
    const { id, onTimerEntryEdited } = this.props;

    const editedTimerEntry = {
      id,
      ...this.state.timerEntry,
    };

    onTimerEntryEdited(editedTimerEntry);
    this.taskInput.current.blur();
  }

  toggleDropdown(e) {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  }

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
              value={startTime.toLocaleString(DateTime.TIME_SIMPLE)}
              onChange={this.timeChangeHandler}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
            <span>-</span>
            <input
              type="time"
              name="endTime"
              readOnly={isCombined}
              value={endTime.toLocaleString(DateTime.TIME_SIMPLE)}
              onChange={this.timeChangeHandler}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex-grow text-center text-black border-x border-gray-300">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <div className="transition-opacity inline-block w-fit opacity-0 group-hover:opacity-100">
            <ReactDatePicker
              selected={date.toJSDate()}
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

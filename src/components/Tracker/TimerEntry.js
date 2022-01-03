import React from "react";

import { v4 as uuid } from "uuid";
import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import { currentTimerActions } from "../../store/slices/currentTimerSlice";
import { connect } from "react-redux";
import {
  AttachMoney,
  CalendarToday,
  ContentCopy,
  ControlPointDuplicate,
  Delete,
  LocalOffer,
  MoreVert,
  PlayArrow,
  PlayArrowRounded,
  PlayCircle,
  TrendingUp,
} from "@mui/icons-material";

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
        ...this.props.timerEntry,
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
    this.props.updateTimerEntry(this.state.timerEntry);
    this.taskInput.current.blur();
  }

  toggleDropdown(e) {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  }

  duplicateEntry(e) {
    const { timerEntry } = this.state;
    if (timerEntry.allEntries) {
      timerEntry.allEntries.forEach((entry) => {
        const duplicatedTimerEntry = {
          ...entry.props.timerEntry,
          id: uuid(),
        };
        this.props.duplicateTimerEntry(duplicatedTimerEntry);
      });
    } else {
      const duplicatedTimerEntry = {
        ...timerEntry,
        id: uuid(),
      };
      this.props.duplicateTimerEntry(duplicatedTimerEntry);
    }

    this.setState({
      isDropdownOpen: false,
    });
  }

  deleteEntry(e) {
    const { timerEntry } = this.state;
    if (timerEntry.allEntries) {
      timerEntry.allEntries.forEach((entry) =>
        this.props.deleteTimerEntry(entry.props.timerEntry)
      );
    } else {
      this.props.deleteTimerEntry(timerEntry);
    }

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
    const timer = {
      ...this.state.timerEntry,
      startTime: DateTime.now(),
      date: DateTime.fromObject({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
    };

    this.props.continueTimerEntry(timer);
  }

  generateTimerEntry() {
    const { timerEntry } = this.state;
    const isCombined = timerEntry.allEntries !== undefined;

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
          className="group w-full flex items-center gap-5 p-4 border-x border-b border-gray-300 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="w-1/3 flex items-center gap-4">
            {isCombined && (
              <div className="w-[35px] h-[35px] flex justify-center items-center bg-blue-500 text-white rounded-[50%]">
                {timerEntry.allEntries.length}
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

          <button className="transition-opacity flex items-center gap-2 opacity-0 group-hover:opacity-100 uppercase">
            <LocalOffer />
          </button>

          <div className="transition-opacity h-full flex items-center opacity-0 group-hover:opacity-100">
            <button
              onClick={this.productiveChangeHandler}
              className={`h-full px-4 border-x border-dotted border-gray-300 ${
                isProductive ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <TrendingUp />
            </button>
            <button
              onClick={this.billableChangeHandler}
              className={`h-full px-4 border-r border-dotted border-gray-300 ${
                isBillable ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <AttachMoney />
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

          <div className="transition-opacity inline-block w-fit opacity-0 group-hover:opacity-100">
            <ReactDatePicker
              selected={date.toJSDate()}
              name="date"
              onChange={this.dateChangeHandler}
              readOnly={isCombined}
              customInput={<CalendarToday />}
            />
          </div>

          <div className="flex-grow h-full flex justify-center items-center text-base">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <button
            onClick={this.continueTimerEntry}
            className="transition-opacity opacity-0 group-hover:opacity-100"
          >
            <PlayCircle />
          </button>

          <div className="relative" ref={this.dropdownOptionsDiv}>
            <button onClick={this.toggleDropdown} ref={this.dropdownBtn}>
              <MoreVert />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-8 right-0 z-10 shadow-xl">
                <ul>
                  <li>
                    <button
                      onClick={this.duplicateEntry}
                      className="w-full flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                    >
                      <ContentCopy fontSize="small" />
                      Duplicate
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={this.deleteEntry}
                      className="w-full flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                    >
                      <Delete fontSize="small" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {showAllEntries && timerEntry.allEntries}
      </>
    );
  }

  render() {
    return this.generateTimerEntry();
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.update(timerEntry));
    },
    deleteTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.delete(timerEntry));
    },
    duplicateTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.create(timerEntry));
    },
    continueTimerEntry: (timer) => {
      dispatch(currentTimerActions.start(timer));
    },
  };
};

export default connect(null, mapDispatchToProps)(TimerEntry);

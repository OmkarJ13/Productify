import {
  AttachMoney,
  CalendarToday,
  ContentCopy,
  Delete,
  LocalOffer,
  MoreVert,
  PlayCircle,
  Save,
  TrendingUp,
} from "@mui/icons-material";

import React from "react";

import ReactDatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { connect } from "react-redux";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import { currentTimerActions } from "../../store/slices/currentTimerSlice";

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
    };

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

  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 1000);
  }

  saveEditedChanges() {
    this.props.updateTimerEntry(this.props.timerEntry);
    this.taskInput.current?.blur();

    toast(() => {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Save /> Updated Timer Entry
        </div>
      );
    });
  }

  toggleDropdown(e) {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  }

  duplicateEntry(e) {
    const { timerEntry } = this.props;

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
    const { timerEntry } = this.props;
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
      ...this.props.timerEntry,
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

  hasMadeChanges(prevProps) {
    return (
      JSON.stringify(prevProps.timerEntry) !==
      JSON.stringify(this.props.timerEntry)
    );
  }

  componentDidUpdate(prevProps) {
    if (this.hasMadeChanges(prevProps)) {
      this.setSaveTimer();
    }
  }

  render() {
    const { isDropdownOpen, showAllEntries } = this.state;
    const {
      task,
      date,
      startTime,
      endTime,
      duration,
      isProductive,
      isBillable,
    } = this.props.timerEntry;

    const isCombined = this.props.allEntries !== undefined;

    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          bodyClassName={"bg-white text-gray-600 font-inter"}
          hideProgressBar={true}
        />

        <div
          className="group w-full flex items-center gap-5 p-4 border-x border-b border-gray-300 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="w-1/3 flex items-center gap-4">
            {isCombined && (
              <div className="w-[35px] h-[35px] flex justify-center items-center bg-blue-500 text-white rounded-[50%]">
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
              onChange={this.props.onTaskChanged}
              className="transition-colors flex-grow p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
          </div>

          <button
            title="Select Tag"
            className="transition-opacity flex items-center gap-2 opacity-0 group-hover:opacity-100 uppercase"
            onClick={this.props.onTagClicked}
          >
            <LocalOffer />
          </button>

          <div className="transition-opacity h-full flex items-center opacity-0 group-hover:opacity-100">
            <button
              title="Is Productive?"
              onClick={this.props.onProductiveChanged}
              className={`h-full px-4 border-x border-dotted border-gray-300 ${
                isProductive ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <TrendingUp />
            </button>
            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
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
              onChange={this.props.onTimeChanged}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
            <span>-</span>
            <input
              type="time"
              name="endTime"
              readOnly={isCombined}
              value={endTime.toLocaleString(DateTime.TIME_SIMPLE)}
              onChange={this.props.onTimeChanged}
              className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
            />
          </div>

          <div className="transition-opacity inline-block w-fit opacity-0 group-hover:opacity-100">
            <ReactDatePicker
              title="Change Date"
              selected={date.toJSDate()}
              name="date"
              onChange={this.props.onDateChanged}
              readOnly={isCombined}
              customInput={<CalendarToday />}
            />
          </div>

          <div className="flex-grow h-full flex justify-center items-center text-base">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <button
            title="Continue Timer Entry"
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
        {showAllEntries && this.props.allEntries}
      </>
    );
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

import React from "react";
import { connect } from "react-redux";

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
import ReactDatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import { currentTimerActions } from "../../store/slices/currentTimerSlice";
import TagSelector from "../Tag/TagSelector";
import TimePicker from "../UI/TimePicker";
import FloatingWindow from "../UI/FloatingWindow";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);

    this.saveTimerID = undefined;

    this.state = {
      isDropdownOpen: false,
      showAllEntries: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.toggleAllEntries = this.toggleAllEntries.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.duplicateEntry = this.duplicateEntry.bind(this);
    this.continueTimerEntry = this.continueTimerEntry.bind(this);
  }

  closeDropdown(e) {
    if (this.state.isDropdownOpen)
      this.setState({
        isDropdownOpen: false,
      });
  }

  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 1500);
  }

  saveEditedChanges() {
    this.props.updateTimerEntry(this.props.timerEntry);

    toast(() => {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Save /> Updated!
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

    const duplicatedTimerEntry = {
      ...timerEntry,
      id: uuid(),
    };
    this.props.duplicateTimerEntry(duplicatedTimerEntry);

    this.setState({
      isDropdownOpen: false,
    });
  }

  deleteEntry(e) {
    const { timerEntry } = this.props;

    this.props.deleteTimerEntry(timerEntry);

    this.setState({
      isDropdownOpen: false,
    });
  }

  toggleAllEntries(e) {
    this.setState({
      showAllEntries: !this.state.showAllEntries,
    });
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
      tag,
      duration,
      isProductive,
      isBillable,
    } = this.props.timerEntry;

    const isCombined = this.props.allEntries !== undefined;
    const { isDuplicate } = this.props;

    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          bodyClassName={"bg-white text-gray-600 font-inter"}
          hideProgressBar={true}
        />

        <div
          className="group w-full flex items-center gap-4 p-4 border-x border-b border-gray-300 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="w-[75%] h-full flex items-center gap-4 border-r border-dotted border-gray-300">
            <div className="flex-grow-[10] flex items-center gap-4">
              {isCombined && (
                <div className="w-[35px] h-[35px] flex justify-center items-center bg-blue-500 text-white rounded-[50%]">
                  {this.props.allEntries.length}
                </div>
              )}
              {isDuplicate && <div className="w-[35px] h-[35px]"></div>}
              <input
                type="text"
                name="task"
                value={task}
                placeholder="Add Task Name"
                readOnly={isCombined}
                autoComplete="off"
                onChange={this.props.onTaskChanged}
                className="transition-colors flex-grow p-1 border border-transparent group-hover:border-gray-300 focus:outline-none text-ellipsis"
              />
            </div>

            <button
              title="Select Tag"
              className="w-[15%] transition-opacity relative h-full opacity-0 group-hover:opacity-100"
              onClick={this.props.onTagClicked}
              disabled={isCombined}
            >
              {this.props.selectingTag && (
                <TagSelector
                  onClose={this.props.onTagClosed}
                  onTagSelected={this.props.onTagSelected}
                />
              )}

              {tag === undefined ? (
                <div className="flex justify-center items-center gap-2">
                  <LocalOffer />
                  <span className="text-xs">Add Tag</span>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-1">
                  <LocalOffer htmlColor={tag.color} />
                  <span className="text-xs">{tag.name}</span>
                </div>
              )}
            </button>

            <div className="transition-opacity h-full flex items-center opacity-0 group-hover:opacity-100">
              <button
                title="Is Productive?"
                onClick={this.props.onProductiveChanged}
                className={`h-full px-2 border-x border-dotted border-gray-300 ${
                  isProductive ? "text-blue-500" : "text-gray-400"
                }`}
                disabled={isCombined}
              >
                <TrendingUp />
              </button>
              <button
                title="Is Billable?"
                onClick={this.props.onBillableChanged}
                className={`h-full px-2 border-r border-dotted border-gray-300 ${
                  isBillable ? "text-blue-500" : "text-gray-400"
                }`}
                disabled={isCombined}
              >
                <AttachMoney />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <TimePicker
                value={startTime.toFormat("HH:mm")}
                onChange={this.props.onStartTimeChanged}
                className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
              />
              <span>-</span>
              <TimePicker
                value={endTime.toFormat("HH:mm")}
                onChange={this.props.onEndTimeChanged}
                className="transition-colors p-1 border border-transparent group-hover:border-gray-300 focus:outline-none"
              />
            </div>

            <button
              className="pr-2 transition-opacity opacity-0 group-hover:opacity-100"
              disabled={isCombined}
            >
              <ReactDatePicker
                title="Change Date"
                selected={date.toJSDate()}
                name="date"
                onChange={this.props.onDateChanged}
                readOnly={isCombined}
                customInput={<CalendarToday />}
                popperPlacement="bottom"
              />
            </button>
          </div>

          <div className="flex-grow h-full flex justify-center items-center text-base">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <div className="h-full flex items-center gap-2">
            <button
              title="Continue Timer Entry"
              onClick={this.continueTimerEntry}
              className="transition-opacity opacity-0 group-hover:opacity-100"
              disabled={isCombined}
            >
              <PlayCircle />
            </button>

            <div className="relative">
              <button onClick={this.toggleDropdown} disabled={isCombined}>
                <MoreVert />
              </button>

              {isDropdownOpen && (
                <FloatingWindow onClose={this.toggleDropdown}>
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
                </FloatingWindow>
              )}
            </div>
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

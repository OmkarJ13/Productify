import React from "react";
import { connect } from "react-redux";

import {
  AttachMoney,
  CalendarToday,
  MoneyOffCsred,
  PlayArrow,
  Save,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { TimePicker, DatePicker } from "@mui/lab";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import { currentTimerActions } from "../../store/slices/currentTimerSlice";
import TagSelector from "../Tag/TagSelector";
import TimerEntryOptionsSelector from "./TimerEntryOptionsSelector";
import MUIPickerHandler from "../UI/MUIPickerHandler";
import { getRelativeDate } from "../../helpers/getRelativeDate";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);

    this.saveTimerID = undefined;

    this.state = {
      showAllEntries: false,
    };

    this.toggleAllEntries = this.toggleAllEntries.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.duplicateEntry = this.duplicateEntry.bind(this);
    this.continueTimerEntry = this.continueTimerEntry.bind(this);
  }

  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 2000);
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

  duplicateEntry(e) {
    const { timerEntry } = this.props;

    const duplicatedTimerEntry = {
      ...timerEntry,
      id: uuid(),
    };
    this.props.duplicateTimerEntry(duplicatedTimerEntry);
  }

  deleteEntry(e) {
    const { timerEntry } = this.props;
    this.props.deleteTimerEntry(timerEntry);
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
      date: DateTime.now().startOf("day"),
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
    const { showAllEntries } = this.state;
    const { task, date, startTime, endTime, tag, duration, isBillable } =
      this.props.timerEntry;

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
          className="group w-full flex items-center p-4 border-x border-b border-gray-300 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="flex-grow h-full flex items-center">
            <div className="flex-grow flex items-center gap-4">
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

            <div className="w-[150px] flex justify-center items-center mx-4">
              <TagSelector
                className="transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 max-w-[125px] h-full flex justify-center items-center"
                disabled={isCombined}
                initialTag={tag}
                onTagSelected={this.props.onTagSelected}
              />
            </div>

            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
              className={`transition-opacity opacity-0 group-hover:opacity-100 h-full px-2 border-x border-gray-300 text-gray-500`}
              disabled={isCombined}
            >
              {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
            </button>

            <div className="mx-4 flex items-center gap-1">
              <MUIPickerHandler
                renderPicker={(otherProps) => {
                  return (
                    <TimePicker
                      {...otherProps}
                      value={startTime}
                      onChange={this.props.onStartTimeChanged}
                      renderInput={({ inputRef, InputProps }) => {
                        return (
                          <button
                            ref={inputRef}
                            onClick={InputProps.onClick}
                            className="transition-colors w-[80px] p-1 border border-transparent group-hover:border-gray-300"
                            disabled={isCombined}
                          >
                            {startTime.toLocaleString(DateTime.TIME_SIMPLE)}
                          </button>
                        );
                      }}
                    />
                  );
                }}
              />
              -
              <MUIPickerHandler
                renderPicker={(otherProps) => {
                  return (
                    <TimePicker
                      {...otherProps}
                      value={endTime}
                      onChange={this.props.onEndTimeChanged}
                      renderInput={({ inputRef, InputProps }) => {
                        return (
                          <button
                            ref={inputRef}
                            onClick={InputProps.onClick}
                            className="transition-colors w-[80px] p-1 border border-transparent group-hover:border-gray-300"
                            disabled={isCombined}
                          >
                            {endTime.toLocaleString(DateTime.TIME_SIMPLE)}
                          </button>
                        );
                      }}
                    />
                  );
                }}
              />
            </div>

            <MUIPickerHandler
              renderPicker={(otherProps) => {
                return (
                  <DatePicker
                    {...otherProps}
                    value={date}
                    onChange={this.props.onDateChanged}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          ref={inputRef}
                          onClick={InputProps.onClick}
                          disabled={isCombined}
                          className="transition-opacity w-[125px] mr-4 opacity-0 group-hover:opacity-100 capitalize flex items-center gap-2 border border-gray-300 p-1"
                        >
                          <span className="flex-grow text-center">
                            {getRelativeDate(date, "day")}
                          </span>
                          <CalendarToday fontSize="small" />
                        </button>
                      );
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="w-[150px] h-full flex justify-center items-center text-base border-x border-gray-300">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <div className="h-full flex items-center gap-1 ml-4">
            <button
              title="Continue Timer Entry"
              onClick={this.continueTimerEntry}
              className="bg-blue-500 text-white rounded-[50%] disabled:bg-gray-600"
              disabled={isCombined || this.props.currentTimer !== null}
            >
              <PlayArrow fontSize="small" />
            </button>

            <TimerEntryOptionsSelector
              onDuplicate={this.duplicateEntry}
              onDelete={this.deleteEntry}
              disabled={isCombined}
            />
          </div>
        </div>
        {showAllEntries && this.props.allEntries}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentTimer: state.currentTimerReducer.currentTimer,
  };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(TimerEntry);

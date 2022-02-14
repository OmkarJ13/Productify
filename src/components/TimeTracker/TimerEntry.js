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
import { DateTime } from "luxon";
import { TimePicker, DatePicker } from "@mui/lab";

import {
  addTimerEntryAsync,
  deleteTimerEntryAsync,
  updateTimerEntryAsync,
} from "../../store/slices/timerEntrySlice";
import { startTimerAsync } from "../../store/slices/timerSlice";
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
        <div className="flex items-center gap-4">
          <Save /> Successfully Saved Changes!
        </div>
      );
    });
  }

  duplicateEntry(e) {
    const { id, ...timerEntryData } = this.props.timerEntry;

    const duplicatedTimerEntry = {
      ...timerEntryData,
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
    const { id, ...timerEntryData } = this.props.timerEntry;

    const timer = {
      ...timerEntryData,
      timerRef: id,
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
          toastClassName={
            "bg-white text-gray-600 font-inter rounded-none border shadow-md border-gray-200"
          }
          hideProgressBar={true}
        />

        <div
          className="group flex w-full items-center border-x border-b border-gray-300 p-4 text-sm"
          onClick={isCombined ? this.toggleAllEntries : null}
        >
          <div className="flex h-full flex-grow items-center">
            <div className="flex flex-grow items-center gap-4">
              {isCombined && (
                <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[50%] bg-blue-500 text-white">
                  {this.props.allEntries.length}
                </div>
              )}
              {isDuplicate && <div className="h-[35px] w-[35px]"></div>}
              <input
                type="text"
                name="task"
                value={task}
                placeholder="Add Task Name"
                readOnly={isCombined}
                autoComplete="off"
                onChange={this.props.onTaskChanged}
                className="flex-grow text-ellipsis border border-transparent p-1 transition-colors focus:outline-none group-hover:border-gray-300"
              />
            </div>

            <div className="mx-4 flex w-[150px] items-center justify-center">
              <TagSelector
                className="flex h-full max-w-[125px] items-center justify-center opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                disabled={isCombined}
                value={tag}
                onChange={this.props.onTagSelected}
              />
            </div>

            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
              className={`h-full border-x border-gray-300 px-2 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100`}
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
                            className="w-[80px] border border-transparent p-1 transition-colors group-hover:border-gray-300"
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
                            className="w-[80px] border border-transparent p-1 transition-colors group-hover:border-gray-300"
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
                    disableFuture
                    onChange={this.props.onDateChanged}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          ref={inputRef}
                          onClick={InputProps.onClick}
                          disabled={isCombined}
                          className="mr-4 flex w-[125px] items-center gap-2 border border-gray-300 p-1 capitalize opacity-0 transition-opacity group-hover:opacity-100"
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

          <div className="flex h-full w-[150px] items-center justify-center border-x border-gray-300 text-base">
            <span>{duration.toFormat("hh:mm:ss")}</span>
          </div>

          <div className="ml-4 flex h-full items-center gap-1">
            <button
              title="Continue Timer Entry"
              onClick={this.continueTimerEntry}
              className="rounded-[50%] bg-blue-500 text-white disabled:bg-gray-600"
              disabled={isCombined || this.props.timer !== null}
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
    timer: state.timerReducer.timer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTimerEntry: (timerEntry) => {
      dispatch(updateTimerEntryAsync(timerEntry));
    },
    deleteTimerEntry: (timerEntry) => {
      dispatch(deleteTimerEntryAsync(timerEntry));
    },
    duplicateTimerEntry: (timerEntry) => {
      dispatch(addTimerEntryAsync(timerEntry));
    },
    continueTimerEntry: (timer) => {
      dispatch(startTimerAsync(timer));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerEntry);

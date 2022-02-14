import React from "react";
import { DatePicker, TimePicker } from "@mui/lab";
import {
  AttachMoney,
  CalendarToday,
  Menu,
  Schedule,
  Done,
  MoneyOffCsred,
} from "@mui/icons-material";
import { DateTime } from "luxon";
import { connect } from "react-redux";

import { addTimerEntryAsync } from "../../store/slices/timerEntrySlice";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import TagSelector from "../../components/Tag/TagSelector";
import MUIPickerHandler from "../UI/MUIPickerHandler";

class ManualMode extends React.Component {
  constructor(props) {
    super(props);
    this.saveTimerEntry = this.saveTimerEntry.bind(this);
  }

  saveTimerEntry() {
    const timerEntry = {
      ...this.props.timerEntry,
    };

    this.props.saveTimerEntry(timerEntry);
    this.props.resetState();
  }

  render() {
    const { task, isBillable, tag, startTime, endTime, date, duration } =
      this.props.timerEntry;

    return (
      <div className="flex h-[75px] w-full items-center border border-gray-200 p-4 text-sm shadow-md">
        <div className="flex h-full flex-grow items-center border-r border-gray-300">
          <input
            name="task"
            type="text"
            value={task}
            placeholder="What have you done?"
            autoComplete="off"
            className="flex-grow border border-gray-300 p-2 focus:outline-none"
            onChange={this.props.onTaskChanged}
          />

          <div className="mx-4 flex w-[150px] items-center justify-center">
            <TagSelector
              className="flex h-full max-w-[125px] items-center justify-center"
              value={tag}
              onChange={this.props.onTagSelected}
            />
          </div>

          <button
            title="Is Billable?"
            onClick={this.props.onBillableChanged}
            className={`mr-4 h-full border-x border-gray-300 px-2`}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>

          <div className="mr-4 flex items-center gap-1">
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
                          className="w-[80px] border border-gray-300 p-2"
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
                          className="w-[80px] border border-gray-300 p-2"
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
                  value={date.toJSDate()}
                  onChange={this.props.onDateChanged}
                  disableFuture
                  showToolbar={false}
                  renderInput={({ inputRef, InputProps }) => {
                    return (
                      <button
                        className="mr-4 flex w-[125px] items-center justify-between gap-2 border border-gray-300 p-2 capitalize"
                        ref={inputRef}
                        onClick={InputProps.onClick}
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

        <div className="mr-4 flex h-full w-[135px] items-center justify-center text-base">
          <span>{duration.toFormat("hh:mm:ss")}</span>
        </div>

        <div className="flex h-full items-center gap-2">
          <button
            onClick={this.saveTimerEntry}
            className="rounded-[50%] bg-gradient-to-br from-blue-500 to-blue-400 p-2 uppercase text-white"
          >
            <Done />
          </button>
          <div className="flex flex-col">
            <button
              title="Timer Mode"
              onClick={this.props.onSwitchTimerMode}
              className="text-gray-400"
            >
              <Schedule fontSize="small" />
            </button>
            <button
              title="Manual Mode"
              onClick={this.props.onSwitchManualMode}
              className={`${
                this.props.trackingMode === "manual"
                  ? "text-gray-600"
                  : "text-gray-400"
              }`}
            >
              <Menu fontSize="small" />
            </button>
          </div>
        </div>
      </div>
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
    saveTimerEntry: (timerEntry) => {
      dispatch(addTimerEntryAsync(timerEntry));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualMode);

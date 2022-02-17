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
      <div className="flex w-full flex-col items-center gap-2 border border-gray-200 p-2 shadow-md md:flex-row md:flex-wrap">
        <input
          name="task"
          type="text"
          value={task}
          placeholder="What have you done?"
          autoComplete="off"
          className="w-full border border-gray-300 p-2 focus:outline-none"
          onChange={this.props.onTaskChanged}
        />
        <div className="flex flex-col items-center gap-2 xs:w-full xs:flex-row xs:justify-between md:w-fit md:flex-grow md:justify-between">
          <div className="flex items-center gap-2 xs:gap-4">
            <TagSelector
              className="max-w-[125px]"
              value={tag}
              onChange={this.props.onTagSelected}
            />
            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
              className={`border-x border-gray-300 py-1 px-2 text-gray-500`}
            >
              {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <MUIPickerHandler
              renderPicker={(otherProps) => {
                return (
                  <TimePicker
                    {...otherProps}
                    ampmInClock
                    value={startTime}
                    onChange={this.props.onStartTimeChanged}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          ref={inputRef}
                          onClick={InputProps.onClick}
                          className="w-[90px] border border-gray-300 p-2"
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
                    ampmInClock
                    value={endTime}
                    onChange={this.props.onEndTimeChanged}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          ref={inputRef}
                          onClick={InputProps.onClick}
                          className="w-[90px] border border-gray-300 p-2"
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
        </div>

        <div className="flex w-full flex-col items-center gap-2 xs:w-full xs:flex-row xs:justify-between md:w-fit">
          <div className="flex items-center">
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
                          className="flex w-[130px] items-center justify-between gap-2 border border-gray-300 p-2"
                          ref={inputRef}
                          onClick={InputProps.onClick}
                        >
                          <span className="flex flex-grow justify-center capitalize">
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

          <div className="flex w-full items-center xs:w-fit">
            <span className="mx-auto flex w-[135px] items-center justify-center">
              {duration.toFormat("hh:mm:ss")}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={this.saveTimerEntry}
                className="rounded-[50%] bg-blue-500 p-2 uppercase text-white"
              >
                <Done />
              </button>
              <div className="flex flex-col">
                <button
                  title="Timer Mode"
                  onClick={() => {
                    this.props.resetState();
                    this.props.onSwitchTimerMode();
                  }}
                  className="text-gray-400"
                >
                  <Schedule fontSize="small" />
                </button>
                <button
                  title="Manual Mode"
                  onClick={() => {
                    this.props.resetState();
                    this.props.onSwitchManualMode();
                  }}
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

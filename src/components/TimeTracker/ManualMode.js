import React from "react";
import { DatePicker, TimePicker } from "@mui/lab";
import {
  AttachMoney,
  CalendarToday,
  ArrowBack,
  ArrowForward,
  ArrowDownward,
  Menu,
  Schedule,
  TrendingUp,
  Alarm,
  Add,
  Done,
} from "@mui/icons-material";
import { DateTime } from "luxon";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";
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
      id: uuid(),
      ...this.props.timerEntry,
    };

    this.props.saveTimerEntry(timerEntry);
    this.props.resetState();
  }

  render() {
    const {
      task,
      isProductive,
      isBillable,
      tag,
      startTime,
      endTime,
      date,
      duration,
    } = this.props.timerEntry;

    return (
      <div className="w-full h-[75px] flex items-center gap-4 p-4 shadow-md border border-gray-200 text-sm">
        <div className="flex-grow h-full flex items-center border-r border-dotted border-gray-300">
          <input
            name="task"
            type="text"
            value={task}
            placeholder="What have you done?"
            autoComplete="off"
            className="flex-grow p-2 border border-gray-300 focus:outline-none"
            onChange={this.props.onTaskChanged}
          />

          <TagSelector
            className="w-[150px] px-4 h-full flex justify-center items-center"
            initialTag={tag}
            onTagSelected={this.props.onTagSelected}
          />

          <div className="h-full flex items-center">
            <button
              title="Is Productive?"
              onClick={this.props.onProductiveChanged}
              className={`h-full px-2 border-x border-dotted border-gray-300 ${
                isProductive ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <TrendingUp />
            </button>

            <button
              title="Is Billable?"
              onClick={this.props.onBillableChanged}
              className={`h-full px-2 border-x border-dotted border-gray-300 ${
                isBillable ? "text-blue-500" : "text-gray-400"
              }`}
            >
              <AttachMoney />
            </button>
          </div>

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
                          className="w-[80px] p-2 border border-gray-300"
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
                          className="w-[80px] p-2 border border-gray-300"
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

          <button className="mr-2">
            <MUIPickerHandler
              renderPicker={(otherProps) => {
                return (
                  <DatePicker
                    {...otherProps}
                    value={date.toJSDate()}
                    onChange={this.props.onDateChanged}
                    showToolbar={false}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          className="w-[125px] flex justify-between items-center gap-2 p-2 border border-gray-300 capitalize"
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
                    components={{
                      OpenPickerIcon: CalendarToday,
                      LeftArrowIcon: ArrowBack,
                      RightArrowIcon: ArrowForward,
                      SwitchViewIcon: ArrowDownward,
                    }}
                  />
                );
              }}
            />
          </button>
        </div>

        <div className="w-[135px] h-full flex justify-center items-center text-base">
          <span>{duration.toFormat("hh:mm:ss")}</span>
        </div>

        <div className="h-full flex items-center gap-2">
          <button
            onClick={this.saveTimerEntry}
            className="p-2 bg-gradient-to-br from-blue-500 to-blue-400 rounded-[50%] text-white uppercase"
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
    currentTimer: state.currentTimerReducer.currentTimer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.create(timerEntry));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualMode);

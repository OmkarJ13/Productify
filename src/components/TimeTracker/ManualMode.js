import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Menu,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";

import React from "react";

import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";

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
      startTime,
      endTime,
      date,
      duration,
    } = this.props.timerEntry;

    return (
      <>
        <input
          name="task"
          type="text"
          className=""
          value={task}
          placeholder="What have you done?"
          autoComplete="off"
          className="flex-grow p-2 border border-gray-300 focus:outline-none"
          onChange={this.props.onTaskChanged}
        />

        <button title="Select Tag" className="px-4">
          <LocalOffer />
        </button>

        <div className="h-full flex items-center">
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
            className={`h-full px-4 border-x border-dotted border-gray-300 ${
              isBillable ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <AttachMoney />
          </button>
        </div>

        <div className="flex items-center gap-2 px-4">
          <input
            name="startTime"
            type="time"
            value={startTime.toLocaleString(DateTime.TIME_SIMPLE)}
            onChange={this.props.onTimeChanged}
            className="p-1 border border-gray-300"
          />
          <span> - </span>
          <input
            name="endTime"
            type="time"
            value={endTime.toLocaleString(DateTime.TIME_SIMPLE)}
            onChange={this.props.onTimeChanged}
            className="p-1 border border-gray-300"
          />
        </div>

        <div className="inline-block w-fit pr-4">
          <ReactDatePicker
            title="Select Date"
            selected={date.toJSDate()}
            onChange={this.props.onDateChanged}
            className=""
            customInput={<CalendarToday />}
          />
        </div>

        <div className="h-full flex items-center px-8 text-center text-base border-l border-dotted border-gray-300">
          <span>{duration.toFormat("hh:mm:ss")}</span>
        </div>

        <button
          onClick={this.saveTimerEntry}
          className="w-1/12 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
        >
          Add
        </button>

        <div className="flex flex-col pl-4">
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
    saveTimerEntry: (timerEntry) => {
      dispatch(timerEntryActions.create(timerEntry));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManualMode);

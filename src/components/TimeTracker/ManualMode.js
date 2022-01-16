import React from "react";

import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Menu,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import TagSelector from "../../components/Tag/TagSelector";
import TimePicker from "../UI/TimePicker";

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
      <div className="w-full flex items-center gap-4 p-4 shadow-md border border-gray-200 text-sm">
        <div className="w-[75%] h-full flex items-center gap-4 border-r border-dotted border-gray-300">
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
            className="w-[15%] h-full flex justify-center items-center"
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

          <div className="flex items-center gap-1">
            <TimePicker
              value={startTime.toFormat("HH:mm")}
              onChange={this.props.onStartTimeChanged}
            />
            <span>-</span>
            <TimePicker
              value={endTime.toFormat("HH:mm")}
              onChange={this.props.onEndTimeChanged}
            />
          </div>

          <button className="pr-2">
            <ReactDatePicker
              title="Select Date"
              selected={date.toJSDate()}
              onChange={this.props.onDateChanged}
              customInput={<CalendarToday />}
              popperPlacement="bottom"
            />
          </button>
        </div>

        <div className="w-[12.5%] h-full flex justify-center items-center text-base">
          <span>{duration.toFormat("hh:mm:ss")}</span>
        </div>

        <div className="w-[12.5%] h-full flex items-center gap-4">
          <button
            onClick={this.saveTimerEntry}
            className="w-[80%] p-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
          >
            Add
          </button>
          <div className="w-[20%] flex flex-col">
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

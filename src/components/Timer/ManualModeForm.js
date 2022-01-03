import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Menu,
  Schedule,
  TrendingUp,
} from "@mui/icons-material";
import { DateTime } from "luxon";
import React from "react";
import ReactDatePicker from "react-datepicker";

class ManualModeForm extends React.Component {
  render() {
    const {
      task,
      startTime,
      endTime,
      duration,
      date,
      isProductive,
      isBillable,
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
          onChange={this.props.taskChangeHandler}
        />

        <button className="px-4">
          <LocalOffer />
        </button>

        <div className="h-full flex items-center">
          <button
            onClick={this.props.productiveChangeHandler}
            className={`h-full px-4 border-x border-dotted border-gray-300 ${
              isProductive ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <TrendingUp />
          </button>

          <button
            onClick={this.props.billableChangeHandler}
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
            onChange={this.props.timeChangeHandler}
            className="p-1 border border-gray-300"
          />
          <span> - </span>
          <input
            name="endTime"
            type="time"
            value={endTime.toLocaleString(DateTime.TIME_SIMPLE)}
            onChange={this.props.timeChangeHandler}
            className="p-1 border border-gray-300"
          />
        </div>

        <div className="inline-block w-fit pr-4">
          <ReactDatePicker
            selected={date.toJSDate()}
            onChange={this.props.dateChangeHandler}
            className=""
            customInput={<CalendarToday />}
          />
        </div>

        <div className="h-full flex items-center px-8 text-center text-base border-l border-dotted border-gray-300">
          <span>{duration.toFormat("hh:mm:ss")}</span>
        </div>

        <button
          onClick={this.props.saveTimerEntry}
          className="w-1/12 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
        >
          Add
        </button>

        <div className="flex flex-col pl-4">
          <button
            onClick={this.props.switchToTimerMode}
            className="text-gray-400"
          >
            <Schedule fontSize="small" />
          </button>
          <button
            onClick={this.props.switchToManualMode}
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

export default ManualModeForm;

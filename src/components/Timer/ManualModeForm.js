import React from "react";
import { toDateString } from "../../helpers/toDateString";

class ManualModeForm extends React.Component {
  render() {
    const { task, startTime, endTime, duration, date } = this.props.timerEntry;

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

        <div className="flex items-center gap-2">
          <input
            name="startTime"
            type="time"
            value={startTime.toTimeStringShort()}
            onChange={this.props.timeChangeHandler}
            className="p-2 border border-gray-300"
          />
          <span> - </span>
          <input
            name="endTime"
            type="time"
            value={endTime.toTimeStringShort()}
            onChange={this.props.timeChangeHandler}
            className="p-2 border border-gray-300"
          />
        </div>

        <div className="flex-grow flex justify-center border-x border-gray-300">
          <span>{duration.toTimeString()}</span>
        </div>

        <input
          type="date"
          name="date"
          value={toDateString(date)}
          onChange={this.props.dateChangeHandler}
          className="p-2 border border-gray-300 focus:outline-none"
        />

        <button
          onClick={this.props.saveTimerEntry}
          className="px-4 py-2 bg-blue-500 text-white uppercase"
        >
          Add
        </button>

        <div className="flex flex-col">
          <button onClick={this.props.switchToTimerMode} className="">
            <i className="fa fa-clock-o" />
          </button>
          <button onClick={this.props.switchToManualMode} className="">
            <i className="fa fa-bars" />
          </button>
        </div>
      </>
    );
  }
}

export default ManualModeForm;

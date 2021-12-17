import React from "react";
import ReactDatePicker from "react-datepicker";

class ManualModeForm extends React.Component {
  render() {
    const { task, startTime, endTime, duration, date } = this.props.timerEntry;
    const dateValue = new Date(date);

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

        <div className="inline-block w-fit">
          <ReactDatePicker
            selected={dateValue}
            onChange={this.props.dateChangeHandler}
            className="p-1"
            customInput={<i className="fa fa-calendar" />}
          />
        </div>

        <button
          onClick={this.props.saveTimerEntry}
          className="px-4 py-2 bg-blue-500 text-white uppercase"
        >
          Add
        </button>

        <div className="flex flex-col">
          <button onClick={this.props.switchToTimerMode}>
            <i
              className={`fa fa-clock-o ${
                this.props.trackingMode === "timer" && "text-gray-600 font-bold"
              }`}
            />
          </button>
          <button onClick={this.props.switchToManualMode}>
            <i
              className={`fa fa-bars ${
                this.props.trackingMode === "manual" &&
                "text-gray-600 font-bold"
              }`}
            />
          </button>
        </div>
      </>
    );
  }
}

export default ManualModeForm;

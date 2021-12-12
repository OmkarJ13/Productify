import React from "react";
import { getDateString } from "../../helpers/getDateString";
import "./ManualModeForm.css";

class ManualModeForm extends React.Component {
  render() {
    const { task, startTime, endTime, duration, date } = this.props.timerEntry;
    console.log(this.props.timerEntry);

    return (
      <>
        <input
          name="task"
          type="text"
          className="Timer__task-input"
          value={task}
          placeholder="What have you worked on?"
          autoComplete="off"
          onChange={this.props.taskChangeHandler}
        />

        <div className="Timer__time-input-container">
          <input
            name="startTime"
            type="time"
            value={startTime.getTimeStringShort()}
            onChange={this.timeChangeHandler}
            className="Timer__start-time-input"
          />
          <span> - </span>
          <input
            name="endTime"
            type="time"
            value={endTime.getTimeStringShort()}
            onChange={this.props.timeChangeHandler}
            className="Timer__end-time-input"
          />
        </div>

        <div className="Timer__duration">
          <span>{duration.getTimeString()}</span>
        </div>

        <input
          type="date"
          value={getDateString(date)}
          onChange={this.props.dateChangeHandler}
          className="Timer__date-input"
        />

        <button onClick={this.props.saveTimerEntry} className="Timer__add-btn">
          Add
        </button>

        <div className="Timer__modes flex-column">
          <button
            onClick={this.props.switchToTimerMode}
            className="Timer__timer-mode-btn"
          >
            <i className="fa fa-clock-o" />
          </button>
          <button
            onClick={this.props.switchToManualMode}
            className="Timer__manual-mode-btn"
          >
            <i className="fa fa-bars" />
          </button>
        </div>
      </>
    );
  }
}

export default ManualModeForm;

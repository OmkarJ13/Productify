import React from "react";
import "./TimerEntry.css";

class TimerEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      taskName: this.props.taskName,
      time: this.props.time,
    };

    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }

  handleEdit(e) {
    this.setState({
      isEditing: true,
    });
  }

  handleDelete(e) {
    this.props.onTimerEntryDeleted(this.props.id);
  }

  handleTaskChange(e) {
    this.setState({
      taskName: e.target.value,
    });
  }

  handleTimeChange(e) {
    this.setState({
      time: {
        ...this.state.time,
        [e.target.name]: e.target.value.padStart(2, "0"),
      },
    });
  }

  handleEditSubmit(e) {
    e.preventDefault();
    const editedTimerEntry = {
      id: this.props.id,
      taskName: this.state.taskName,
      time: this.state.time,
    };

    this.props.onTimerEntryEdited(editedTimerEntry);

    this.setState({
      isEditing: false,
    });
  }

  generateTimerEntry() {
    const { hours, minutes, seconds } = this.props.time;

    return (
      <div className="TimerEntry">
        <div className="TimerEntry__actions">
          <button className="TimerEntry__edit-btn" onClick={this.handleEdit}>
            <i className="fa fa-pencil fa-2x" />
          </button>
          <button
            className="TimerEntry__delete-btn"
            onClick={this.handleDelete}
          >
            <i className="fa fa-trash fa-2x" />
          </button>
        </div>

        <div className="TimerEntry__task">
          <span>{this.props.taskName}</span>
        </div>

        <div className="TimerEntry__time">
          <span>
            {hours}:{minutes}:{seconds}
          </span>
        </div>
      </div>
    );
  }

  generateTimerEntryEditor() {
    const { hours, minutes, seconds } = this.state.time;

    return (
      <form className="TimerEntry-editor" onSubmit={this.handleEditSubmit}>
        <div className="TimerEntry-editor__inputs">
          <div className="TimerEntry-editor__task-input">
            <label htmlFor="taskName">Task</label>
            <input
              name="taskName"
              type="text"
              value={this.state.taskName}
              onChange={this.handleTaskChange}
            />
          </div>

          <div className="TimerEntry-editor__time-input">
            <label htmlFor="hours">Hours</label>
            <input
              name="hours"
              type="number"
              min="0"
              value={hours}
              onChange={this.handleTimeChange}
            />
            <label htmlFor="minutes">Minutes</label>
            <input
              name="minutes"
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={this.handleTimeChange}
            />
            <label htmlFor="seconds">Seconds</label>
            <input
              name="seconds"
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={this.handleTimeChange}
            />
          </div>
        </div>

        <div className="TimerEntry-editor__actions">
          <button type="submit" className="TimerEntry-editor__confirm-btn">
            <i className="fa fa-check" />
          </button>
        </div>
      </form>
    );
  }

  render() {
    const { isEditing } = this.state;
    return isEditing
      ? this.generateTimerEntryEditor()
      : this.generateTimerEntry();
  }
}

export default TimerEntry;

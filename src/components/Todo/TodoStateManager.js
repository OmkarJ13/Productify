import { DateTime } from "luxon";
import React from "react";

class TodoStateManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todo: this.props.todo ?? {
        isDone: false,
        isBillable: false,
        task: "",
        tag: null,
        priority: 0,
        date: DateTime.now().startOf("day"),
      },
    };

    this.handleDoneChanged = this.handleDoneChanged.bind(this);
    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleTagSelected = this.handleTagSelected.bind(this);
    this.handleBillableChanged = this.handleBillableChanged.bind(this);
    this.handlePrioritySelected = this.handlePrioritySelected.bind(this);
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.resetState = this.resetState.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  handleDoneChanged(e) {
    this.setState((prevState) => {
      return {
        todo: {
          ...this.state.todo,
          isDone: !prevState.todo.isDone,
        },
      };
    });
  }

  handleTaskChanged(e) {
    this.setState({
      todo: {
        ...this.state.todo,
        task: e.target.value,
      },
    });
  }

  handleTagSelected(tag) {
    this.setState({
      todo: {
        ...this.state.todo,
        tag,
      },
    });
  }

  handleBillableChanged(e) {
    this.setState((prevState) => {
      return {
        todo: {
          ...prevState.todo,
          isBillable: !prevState.todo.isBillable,
        },
      };
    });
  }

  handlePrioritySelected(priority) {
    this.setState({
      todo: {
        ...this.state.todo,
        priority,
      },
    });
  }

  handleDateChanged(date) {
    this.setState({
      todo: {
        ...this.state.todo,
        date,
      },
    });
  }

  updateState(newState) {
    this.setState(newState);
  }

  resetState() {
    this.setState({
      todo: {
        isDone: false,
        isBillable: false,
        task: "",
        tag: null,
        priority: 0,
        date: DateTime.now().startOf("day"),
      },
    });
  }

  render() {
    return this.props.renderTodo({
      todo: this.state.todo,
      onDoneChanged: this.handleDoneChanged,
      onTaskChanged: this.handleTaskChanged,
      onTagSelected: this.handleTagSelected,
      onBillableChanged: this.handleBillableChanged,
      onPrioritySelected: this.handlePrioritySelected,
      onDateChanged: this.handleDateChanged,
      resetState: this.resetState,
      updateState: this.updateState,
    });
  }
}

export default TodoStateManager;

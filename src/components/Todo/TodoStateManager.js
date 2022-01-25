import { DateTime } from "luxon";
import React from "react";

class TodoStateManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: {
        task: "",
        tag: undefined,
        priority: 0,
        dueDate: DateTime.now().startOf("minute"),
      },
    };

    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleTagSelected = this.handleTagSelected.bind(this);
    this.handlePrioritySelected = this.handlePrioritySelected.bind(this);
    this.handleDueDateChanged = this.handleDueDateChanged.bind(this);
    this.resetState = this.resetState.bind(this);
    this.updateState = this.updateState.bind(this);
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

  handlePrioritySelected(priority) {
    this.setState({
      todo: {
        ...this.state.todo,
        priority,
      },
    });
  }

  handleDueDateChanged(dueDate) {
    this.setState({
      todo: {
        ...this.state.todo,
        dueDate,
      },
    });
  }

  updateState(newState) {
    this.setState(newState);
  }

  resetState() {
    this.setState({
      todo: {
        task: "",
        tag: undefined,
        priority: 0,
        dueDate: DateTime.now().startOf("day"),
      },
    });
  }

  render() {
    return this.props.renderTodo({
      todo: this.state.todo,
      onTaskChanged: this.handleTaskChanged,
      onTagSelected: this.handleTagSelected,
      onPrioritySelected: this.handlePrioritySelected,
      onDueDateChanged: this.handleDueDateChanged,
      resetState: this.resetState,
      updateState: this.updateState,
    });
  }
}

export default TodoStateManager;

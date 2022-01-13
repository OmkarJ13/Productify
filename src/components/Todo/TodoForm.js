import { DateTime } from "luxon";
import React from "react";

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectingTag: false,
      selectingPriority: false,
      todo: {
        task: "",
        tag: undefined,
        priority: 0,
        dueDate: DateTime.fromObject({
          millisecond: 0,
          second: 0,
          minute: 0,
          hour: 0,
        }),
      },
    };

    this.openTagSelector = this.openTagSelector.bind(this);
    this.closeTagSelector = this.closeTagSelector.bind(this);
    this.openPrioritySelector = this.openPrioritySelector.bind(this);
    this.closePrioritySelector = this.closePrioritySelector.bind(this);
    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleTagChanged = this.handleTagChanged.bind(this);
    this.handlePriorityChanged = this.handlePriorityChanged.bind(this);
    this.handleDueDateChanged = this.handleDueDateChanged.bind(this);
    this.resetState = this.resetState.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  openTagSelector() {
    if (!this.state.selectingTag)
      this.setState({
        selectingTag: true,
      });
  }

  closeTagSelector() {
    if (this.state.selectingTag)
      this.setState({
        selectingTag: false,
      });
  }

  openPrioritySelector() {
    if (!this.state.selectingPriority)
      this.setState({
        selectingPriority: true,
      });
  }

  closePrioritySelector() {
    if (this.state.selectingPriority)
      this.setState({
        selectingPriority: false,
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

  handleTagChanged(tag) {
    this.setState({
      todo: {
        ...this.state.todo,
        tag,
      },
    });

    this.closeTagSelector();
  }

  handlePriorityChanged(priority) {
    this.setState({
      todo: {
        ...this.state.todo,
        priority,
      },
    });

    this.closePrioritySelector();
  }

  handleDueDateChanged(date) {
    this.setState({
      todo: {
        ...this.state.todo,
        dueDate: DateTime.fromJSDate(new Date(date)),
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
        dueDate: DateTime.fromObject({
          millisecond: 0,
          second: 0,
          minute: 0,
          hour: 0,
        }),
      },
    });
  }

  render() {
    const { UI } = this.props;
    return (
      <UI
        todo={this.state.todo}
        selectingTag={this.state.selectingTag}
        selectingPriority={this.state.selectingPriority}
        onTagSelectorOpened={this.openTagSelector}
        onTagSelectorClosed={this.closeTagSelector}
        onPrioritySelectorOpened={this.openPrioritySelector}
        onPrioritySelectorClosed={this.closePrioritySelector}
        onTaskChanged={this.handleTaskChanged}
        onTagChanged={this.handleTagChanged}
        onPriorityChanged={this.handlePriorityChanged}
        onDueDateChanged={this.handleDueDateChanged}
        resetState={this.resetState}
        updateState={this.updateState}
      />
    );
  }
}

export default TodoForm;

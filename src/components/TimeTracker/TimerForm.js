import React from "react";

import { DateTime, Duration } from "luxon";

class TimerForm extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.timerEntry) {
      this.state = {
        timerEntry: this.props.timerEntry,
      };
    } else {
      this.state = {
        timerEntry: {
          task: "",
          tag: undefined,
          isProductive: false,
          isBillable: false,
          startTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
          endTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
          date: DateTime.fromObject({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
          }),
          duration: Duration.fromMillis(0),
        },
      };
    }

    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleTagSelected = this.handleTagSelected.bind(this);
    this.handleProductiveChanged = this.handleProductiveChanged.bind(this);
    this.handleBillableChanged = this.handleBillableChanged.bind(this);
    this.handleStartTimeChanged = this.handleStartTimeChanged.bind(this);
    this.handleEndTimeChanged = this.handleEndTimeChanged.bind(this);
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.handleDurationChanged = this.handleDurationChanged.bind(this);
    this.updateState = this.updateState.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  handleTaskChanged(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        task: e.target.value,
      },
    });
  }

  handleTagSelected(tag) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        tag,
      },
    });
  }

  handleProductiveChanged(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        isProductive: !this.state.timerEntry.isProductive,
      },
    });
  }

  handleBillableChanged(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        isBillable: !this.state.timerEntry.isBillable,
      },
    });
  }

  handleStartTimeChanged(e) {
    const time = DateTime.fromFormat(e, "HH:mm");
    const { endTime } = this.state.timerEntry;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          startTime: time,
          endTime: endTime.set({ second: 0, millisecond: 0 }),
        },
      },
      () => {
        const changedDuration = this.calculateDuration();

        this.setState({
          timerEntry: {
            ...this.state.timerEntry,
            duration: changedDuration,
          },
        });
      }
    );
  }

  handleEndTimeChanged(e) {
    const time = DateTime.fromFormat(e, "HH:mm");
    const { startTime } = this.state.timerEntry;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          startTime: startTime.set({
            second: 0,
            millisecond: 0,
          }),
          endTime: time,
        },
      },
      () => {
        const changedDuration = this.calculateDuration();

        this.setState({
          timerEntry: {
            ...this.state.timerEntry,
            duration: changedDuration,
          },
        });
      }
    );
  }

  calculateDuration() {
    const { startTime, endTime } = this.state.timerEntry;
    const difference = endTime.diff(startTime);

    if (difference.toMillis() < 0) {
      return difference.plus({ day: 1 });
    }

    return difference;
  }

  handleDateChanged(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date: DateTime.fromJSDate(new Date(e)),
      },
    });
  }

  handleDurationChanged(newDuration) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        duration: newDuration,
      },
    });
  }

  updateState(newState) {
    this.setState(newState);
  }

  resetState() {
    this.setState({
      timerEntry: {
        task: "",
        date: DateTime.fromObject({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }),
        startTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        endTime: DateTime.fromObject({ second: 0, millisecond: 0 }),
        duration: Duration.fromMillis(0),
        isProductive: false,
        isBillable: false,
      },
    });
  }

  render() {
    const { UI } = this.props;
    return (
      <UI
        timerEntry={this.state.timerEntry}
        onTaskChanged={this.handleTaskChanged}
        onTagSelected={this.handleTagSelected}
        onProductiveChanged={this.handleProductiveChanged}
        onBillableChanged={this.handleBillableChanged}
        onStartTimeChanged={this.handleStartTimeChanged}
        onEndTimeChanged={this.handleEndTimeChanged}
        onDateChanged={this.handleDateChanged}
        onDurationChanged={this.handleDurationChanged}
        updateState={this.updateState}
        resetState={this.resetState}
      />
    );
  }
}

export default TimerForm;

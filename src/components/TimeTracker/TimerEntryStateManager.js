import React from "react";
import { DateTime, Duration } from "luxon";

class TimerEntryStateManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timerEntry: this.props.timerEntry ?? {
        task: "",
        tag: undefined,
        isProductive: false,
        isBillable: false,
        startTime: DateTime.now().startOf("minute"),
        endTime: DateTime.now().startOf("minute"),
        date: DateTime.now().startOf("day"),
        duration: Duration.fromMillis(0),
      },
    };

    this.handleTaskChanged = this.handleTaskChanged.bind(this);
    this.handleTagSelected = this.handleTagSelected.bind(this);
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

  handleBillableChanged(e) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        isBillable: !this.state.timerEntry.isBillable,
      },
    });
  }

  handleStartTimeChanged(e) {
    const { endTime } = this.state.timerEntry;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          startTime: e,
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
    const { startTime } = this.state.timerEntry;

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          startTime: startTime.set({
            second: 0,
            millisecond: 0,
          }),
          endTime: e,
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

  handleDateChanged(date) {
    this.setState({
      timerEntry: {
        ...this.state.timerEntry,
        date,
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
        date: DateTime.now().startOf("day"),
        startTime: DateTime.now().startOf("minute"),
        endTime: DateTime.now().startOf("minute"),
        duration: Duration.fromMillis(0),
        isProductive: false,
        isBillable: false,
      },
    });
  }

  render() {
    return this.props.renderTimerEntry({
      timerEntry: this.state.timerEntry,
      onTaskChanged: this.handleTaskChanged,
      onTagSelected: this.handleTagSelected,
      onBillableChanged: this.handleBillableChanged,
      onStartTimeChanged: this.handleStartTimeChanged,
      onEndTimeChanged: this.handleEndTimeChanged,
      onDateChanged: this.handleDateChanged,
      onDurationChanged: this.handleDurationChanged,
      updateState: this.updateState,
      resetState: this.resetState,
    });
  }
}

export default TimerEntryStateManager;

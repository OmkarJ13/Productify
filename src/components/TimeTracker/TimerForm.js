import React from "react";

import { DateTime, Duration } from "luxon";

class TimerForm extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.timerEntry) {
      this.state = {
        selectingTag: false,
        timerEntry: this.props.timerEntry,
      };
    } else {
      this.state = {
        selectingTag: false,
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
    this.handleTagClicked = this.handleTagClicked.bind(this);
    this.handleTagClosed = this.handleTagClosed.bind(this);
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

  handleTagClicked(e) {
    if (!this.state.selectingTag) {
      this.setState({
        selectingTag: true,
      });
    }
  }

  handleTagClosed() {
    if (this.state.selectingTag) {
      this.setState({
        selectingTag: false,
      });
    }
  }

  handleTagSelected(tag) {
    this.setState({
      selectingTag: false,
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
    const time = DateTime.fromFormat(e, "hh:mm");

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          startTime: time,
        },
      },
      () => {
        const { startTime, endTime } = this.state.timerEntry;
        const difference = endTime.diff(startTime);

        let changedDuration;
        if (difference.toMillis() < 0) {
          changedDuration = difference.plus({ day: 1 });
        } else {
          changedDuration = difference;
        }

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
    const time = DateTime.fromFormat(e, "hh:mm");

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          endTime: time,
        },
      },
      () => {
        const { startTime, endTime } = this.state.timerEntry;
        const difference = endTime.diff(startTime);

        let changedDuration;
        if (difference.toMillis() < 0) {
          changedDuration = difference.plus({ day: 1 });
        } else {
          changedDuration = difference;
        }

        this.setState({
          timerEntry: {
            ...this.state.timerEntry,
            duration: changedDuration,
          },
        });
      }
    );
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
        selectingTag={this.state.selectingTag}
        onTaskChanged={this.handleTaskChanged}
        onTagClicked={this.handleTagClicked}
        onTagClosed={this.handleTagClosed}
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

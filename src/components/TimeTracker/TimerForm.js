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
    this.handleProductiveChanged = this.handleProductiveChanged.bind(this);
    this.handleBillableChanged = this.handleBillableChanged.bind(this);
    this.handleTimeChanged = this.handleTimeChanged.bind(this);
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

  handleTagClicked(e) {}

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

  handleTimeChanged(e) {
    const time = DateTime.fromFormat(e.target.value, "hh:mm");

    this.setState(
      {
        timerEntry: {
          ...this.state.timerEntry,
          [e.target.name]: time,
        },
      },
      () => {
        const { startTime, endTime } = this.state.timerEntry;
        const changedDuration = endTime.diff(startTime);

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
        onTaskChanged={this.handleTaskChanged}
        onTagClicked={this.handleTagClicked}
        onProductiveChanged={this.handleProductiveChanged}
        onBillableChanged={this.handleBillableChanged}
        onTimeChanged={this.handleTimeChanged}
        onDateChanged={this.handleDateChanged}
        onDurationChanged={this.handleDurationChanged}
        updateState={this.updateState}
        resetState={this.resetState}
      />
    );
  }
}

export default TimerForm;

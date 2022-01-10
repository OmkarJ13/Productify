import React from "react";

import TimerForm from "./TimerForm";
import TimerMode from "./TimerMode";
import ManualMode from "./ManualMode";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.timerId = undefined;

    this.state = {
      trackingMode: "timer",
    };

    this.handleSwitchTimerMode = this.handleSwitchTimerMode.bind(this);
    this.handleSwitchManualMode = this.handleSwitchManualMode.bind(this);
  }

  handleSwitchTimerMode() {
    this.setState({
      trackingMode: "timer",
    });
  }

  handleSwitchManualMode() {
    this.setState({
      trackingMode: "manual",
    });
  }

  generateTimerForm() {
    return this.state.trackingMode === "timer" ? (
      <TimerForm
        UI={(otherProps) => (
          <TimerMode
            trackingMode={this.state.trackingMode}
            onSwitchTimerMode={this.handleSwitchTimerMode}
            onSwitchManualMode={this.handleSwitchManualMode}
            {...otherProps}
          />
        )}
      />
    ) : (
      <TimerForm
        UI={(otherProps) => (
          <ManualMode
            trackingMode={this.state.trackingMode}
            onSwitchTimerMode={this.handleSwitchTimerMode}
            onSwitchManualMode={this.handleSwitchManualMode}
            {...otherProps}
          />
        )}
      />
    );
  }

  render() {
    return this.generateTimerForm();
  }
}

export default Timer;

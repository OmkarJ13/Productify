import { Alarm, Check, ListAlt, Timer } from "@mui/icons-material";
import { TimePicker } from "@mui/lab";
import { DateTime } from "luxon";
import React from "react";
import { connect } from "react-redux";

import FloatingWindow from "../UI/FloatingWindow";
import MUIPickerHandler from "../UI/MUIPickerHandler";

class TodoTrackWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "automatic",
      data: {
        startTime: DateTime.now().startOf("minute"),
        endTime: DateTime.now().startOf("minute"),
      },
    };

    this.switchToAutomatic = this.switchToAutomatic.bind(this);
    this.switchToManual = this.switchToManual.bind(this);
    this.handleStartTimeChanged = this.handleStartTimeChanged.bind(this);
    this.handleEndTimeChanged = this.handleEndTimeChanged.bind(this);
    this.handleStartTracking = this.handleStartTracking.bind(this);
    this.handleManualTimeEntered = this.handleManualTimeEntered.bind(this);
  }

  switchToAutomatic() {
    if (this.state.activeTab === "automatic") return;
    this.setState({
      activeTab: "automatic",
    });
  }

  switchToManual() {
    if (this.state.activeTab === "manual") return;
    this.setState({
      activeTab: "manual",
    });
  }

  handleStartTimeChanged(e) {
    this.setState({
      data: {
        ...this.state.data,
        startTime: e,
      },
    });
  }

  handleEndTimeChanged(e) {
    this.setState({
      data: {
        ...this.state.data,
        endTime: e,
      },
    });
  }

  handleStartTracking() {
    this.props.onStartTracking();
    this.props.onClose();
  }

  handleManualTimeEntered() {
    this.props.onManualTimeEntered(this.state.data);
    this.props.onClose();
  }

  render() {
    const {
      activeTab,
      data: { startTime, endTime },
    } = this.state;

    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        buttonRef={this.props.buttonRef}
      >
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center border-b border-gray-300">
            <button
              onClick={this.switchToAutomatic}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-300 ${
                activeTab !== "automatic" ? "text-gray-400" : ""
              } font-bold text-sm`}
            >
              <Alarm /> Automatic
            </button>

            <button
              onClick={this.switchToManual}
              className={`flex items-center gap-2 px-4 py-2 ${
                activeTab !== "manual" ? "text-gray-400" : ""
              } font-bold text-sm`}
            >
              <ListAlt /> Manual
            </button>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            {activeTab === "automatic" ? (
              <button
                onClick={this.handleStartTracking}
                className="flex justify-center items-center gap-2 px-4 py-2 my-4 rounded bg-blue-500 text-white disabled:bg-gray-600"
                disabled={this.props.timer !== null}
              >
                <Timer /> Start Tracking
              </button>
            ) : (
              <>
                <div className="w-full flex items-center gap-2 my-4">
                  <MUIPickerHandler
                    renderPicker={(otherProps) => {
                      return (
                        <TimePicker
                          value={startTime}
                          onChange={this.handleStartTimeChanged}
                          renderInput={({ inputRef, InputProps }) => {
                            return (
                              <button
                                ref={inputRef}
                                onClick={InputProps.onClick}
                                className="flex-grow p-1 border border-gray-300"
                              >
                                {startTime.toLocaleString(DateTime.TIME_SIMPLE)}
                              </button>
                            );
                          }}
                          {...otherProps}
                        />
                      );
                    }}
                  />
                  -
                  <MUIPickerHandler
                    renderPicker={(otherProps) => {
                      return (
                        <TimePicker
                          value={endTime}
                          onChange={this.handleEndTimeChanged}
                          renderInput={({ inputRef, InputProps }) => {
                            return (
                              <button
                                ref={inputRef}
                                onClick={InputProps.onClick}
                                className="flex-grow p-1 border border-gray-300"
                              >
                                {endTime.toLocaleString(DateTime.TIME_SIMPLE)}
                              </button>
                            );
                          }}
                          {...otherProps}
                        />
                      );
                    }}
                  />
                </div>
                <button
                  onClick={this.handleManualTimeEntered}
                  className="self-end flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded"
                >
                  <Check fontSize="small" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </FloatingWindow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timer: state.timerReducer.timer,
  };
};

export default connect(mapStateToProps)(TodoTrackWindow);

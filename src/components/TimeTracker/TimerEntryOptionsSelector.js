import { MoreVert } from "@mui/icons-material";
import React from "react";
import FloatingWindowHandler from "../UI/WindowHandler";
import TimerEntryOptionsWindow from "./TimerEntryOptionsWindow";

class TimerEntryOptionsSelector extends React.Component {
  render() {
    const { onDuplicate, onDelete, ...otherProps } = this.props;

    return (
      <FloatingWindowHandler
        {...otherProps}
        Window={(otherProps) => {
          return (
            <TimerEntryOptionsWindow
              onDuplicate={this.props.onDuplicate}
              onDelete={this.props.onDelete}
              {...otherProps}
            />
          );
        }}
      >
        <MoreVert />
      </FloatingWindowHandler>
    );
  }
}

export default TimerEntryOptionsSelector;

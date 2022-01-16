import { MoreVert } from "@mui/icons-material";
import React from "react";
import FloatingWindowHandler from "../UI/FloatingWindowHandler";
import TimerEntryOptionsWindow from "./TimerEntryOptionsWindow";

class TimerEntryOptionsSelector extends React.Component {
  render() {
    return (
      <FloatingWindowHandler
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

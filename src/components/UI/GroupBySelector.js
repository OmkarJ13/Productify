import { Category } from "@mui/icons-material";
import React from "react";

import WindowHandler from "./WindowHandler";

class GroupBySelector extends React.Component {
  render() {
    const { value, Window, onChange, ...otherProps } = this.props;

    return (
      <WindowHandler
        className="h-full flex items-center gap-2"
        {...otherProps}
        renderWindow={(otherProps) => {
          return (
            <Window
              group={value}
              onGroupBySelected={onChange}
              {...otherProps}
            />
          );
        }}
      >
        <Category /> Group
      </WindowHandler>
    );
  }
}

export default GroupBySelector;

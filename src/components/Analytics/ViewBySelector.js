import { ViewList } from "@mui/icons-material";
import React from "react";

import ViewByWindow from "./ViewByWindow";
import WindowHandler from "../UI/WindowHandler";

class ViewBySelector extends React.Component {
  render() {
    const { value, onChange, ...otherProps } = this.props;

    return (
      <WindowHandler
        className="flex h-full items-center gap-2"
        {...otherProps}
        renderWindow={(otherProps) => {
          return (
            <ViewByWindow
              view={value}
              onViewBySelected={onChange}
              {...otherProps}
            />
          );
        }}
      >
        <ViewList /> View
      </WindowHandler>
    );
  }
}

export default ViewBySelector;

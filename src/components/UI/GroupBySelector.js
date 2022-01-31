import { Category } from "@mui/icons-material";
import React from "react";

import WindowHandler from "./WindowHandler";

class GroupBySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.value ?? "date",
    };

    this.handleGroupBySelected = this.handleGroupBySelected.bind(this);
  }

  handleGroupBySelected(e) {
    this.setState(
      {
        group: e,
      },
      () => {
        this.props.onChange && this.props.onChange(e);
      }
    );
  }

  render() {
    const { value, Window, onChange, ...otherProps } = this.props;
    const { group } = this.state;

    return (
      <WindowHandler
        className="h-full flex items-center gap-2"
        {...otherProps}
        Window={(otherProps) => {
          return (
            <Window
              group={group}
              onGroupBySelected={this.handleGroupBySelected}
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

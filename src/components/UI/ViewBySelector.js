import { ViewList } from "@mui/icons-material";
import React from "react";

import ViewByWindow from "./ViewByWindow";
import WindowHandler from "./WindowHandler";

class ViewBySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.value ?? "week",
    };

    this.handleViewBySelected = this.handleViewBySelected.bind(this);
  }

  handleViewBySelected(e) {
    this.setState(
      {
        view: e,
      },
      () => {
        this.props.onChange && this.props.onChange(e);
      }
    );
  }

  render() {
    const { value, onChange, ...otherProps } = this.props;
    const { view } = this.state;

    return (
      <WindowHandler
        className="h-full flex items-center gap-2"
        {...otherProps}
        Window={(otherProps) => {
          return (
            <ViewByWindow
              view={view}
              onViewBySelected={this.handleViewBySelected}
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

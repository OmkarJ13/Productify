import React from "react";
import { Error } from "@mui/icons-material";

import { priorities } from "../../helpers/priorities";
import PrioritySelectorWindow from "./PrioritySelectorWindow";
import WindowHandler from "../UI/WindowHandler";

class PrioritySelector extends React.Component {
  getPriorityTitle(priority) {
    const priorityName = priorities[priority].name;
    const priorityColor = priorities[priority].color;

    return (
      <div
        className={`flex w-full items-center justify-center gap-2 rounded-full px-2 py-1 text-white`}
        style={{ backgroundColor: priorityColor }}
      >
        <Error fontSize="small" />
        <span className="text-xs">{priorityName}</span>
      </div>
    );
  }

  render() {
    const { value, onChange, ...otherProps } = this.props;

    return (
      <WindowHandler
        {...otherProps}
        renderWindow={(otherProps) => {
          return (
            <PrioritySelectorWindow
              onPrioritySelected={onChange}
              {...otherProps}
            />
          );
        }}
      >
        {this.getPriorityTitle(value)}
      </WindowHandler>
    );
  }
}

export default PrioritySelector;

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
        className={`w-full h-full px-2 py-1 flex justify-center items-center gap-2 text-white rounded-full`}
        style={{ backgroundColor: priorityColor }}
      >
        <Error fontSize="small" />
        <span className="text-xs">{priorityName}</span>
      </div>
    );
  }

  render() {
    const { initialPriority, onPrioritySelected, ...otherProps } = this.props;

    return (
      <WindowHandler
        {...otherProps}
        renderWindow={(otherProps) => {
          return (
            <PrioritySelectorWindow
              onPrioritySelected={onPrioritySelected}
              {...otherProps}
            />
          );
        }}
      >
        {this.getPriorityTitle(initialPriority)}
      </WindowHandler>
    );
  }
}

export default PrioritySelector;

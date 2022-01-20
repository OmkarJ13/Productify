import React from "react";
import { Error } from "@mui/icons-material";

import { priorities } from "../../helpers/priorities";
import PrioritySelectorWindow from "./PrioritySelectorWindow";
import FloatingWindowHandler from "../UI/FloatingWindowHandler";

class PrioritySelector extends React.Component {
  getPriorityTitle(priority) {
    const priorityName = priorities[priority].name;
    const priorityStyles = priorities[priority].styles;

    return (
      <div
        className={`flex justify-center items-center gap-2 ${priorityStyles}`}
      >
        <Error />
        <span className="text-xs">{priorityName}</span>
      </div>
    );
  }

  render() {
    const { initialPriority, onPrioritySelected, ...otherProps } = this.props;

    return (
      <FloatingWindowHandler
        {...otherProps}
        Window={(otherProps) => {
          return (
            <PrioritySelectorWindow
              onPrioritySelected={onPrioritySelected}
              {...otherProps}
            />
          );
        }}
      >
        {this.getPriorityTitle(initialPriority)}
      </FloatingWindowHandler>
    );
  }
}

export default PrioritySelector;

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
    const { className, initialPriority } = this.props;

    return (
      <FloatingWindowHandler
        className={className}
        Window={(otherProps) => {
          return (
            <PrioritySelectorWindow
              onPrioritySelected={this.props.onPrioritySelected}
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

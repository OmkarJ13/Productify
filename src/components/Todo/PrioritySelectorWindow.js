import { Error } from "@mui/icons-material";
import React from "react";

import { priorities } from "../../helpers/priorities";
import FloatingWindow from "../UI/FloatingWindow";

class PrioritySelectorWindow extends React.Component {
  constructor(props) {
    super(props);
    this.prioritySelectedHandler = this.prioritySelectedHandler.bind(this);
  }

  prioritySelectedHandler(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      const idx = clicked.dataset.idx;
      this.props.onPrioritySelected(idx);
      this.props.onClose();
    }
  }

  render() {
    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        buttonRef={this.props.buttonRef}
      >
        <div className="flex flex-col items-start gap-4 p-4 text-sm">
          <span>Select Priority</span>
          <div className="flex min-w-[15vw] flex-col">
            {priorities.map((priority, i) => {
              return (
                <button
                  key={i}
                  data-idx={i}
                  className={`flex w-full items-center gap-2 p-2 hover:bg-gray-200`}
                  onClick={this.prioritySelectedHandler}
                  style={{ color: priority.color }}
                >
                  <Error />
                  <span>{priority.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </FloatingWindow>
    );
  }
}

export default PrioritySelectorWindow;

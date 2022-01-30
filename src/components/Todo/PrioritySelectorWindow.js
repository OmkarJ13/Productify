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
        anchorEl={this.props.anchorEl}
      >
        <div className="p-4 flex flex-col items-start gap-4 text-sm">
          <span>Select Priority</span>
          <div className="min-w-[15vw] flex flex-col">
            {priorities.map((priority, i) => {
              return (
                <button
                  key={i}
                  data-idx={i}
                  className={`w-full p-2 flex items-center gap-2 hover:bg-gray-200`}
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

import { Error } from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";
import { priorities } from "../../helpers/priorities";

class PrioritySelector extends React.Component {
  constructor(props) {
    super(props);
    this.prioritySelectedHandler = this.prioritySelectedHandler.bind(this);
  }

  prioritySelectedHandler(e) {
    const clicked = e.target.closest("a");
    if (clicked) {
      const idx = clicked.dataset.idx;
      this.props.onPrioritySelected(idx);
    }
  }

  render() {
    return (
      <FloatingWindow onClose={this.props.onClose}>
        <div className="p-4 flex flex-col items-start gap-4">
          <span>Select Priority</span>
          <div className="min-w-[15vw] flex flex-col">
            {priorities.map((priority, i) => {
              return (
                <a
                  key={i}
                  data-idx={i}
                  className={`w-full p-2 flex items-center gap-2 ${priority.styles} hover:bg-gray-200`}
                  onClick={this.prioritySelectedHandler}
                >
                  <Error />
                  <span>{priority.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </FloatingWindow>
    );
  }
}

export default PrioritySelector;

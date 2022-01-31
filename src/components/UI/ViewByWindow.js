import { Check } from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";

class ViewByWindow extends React.Component {
  constructor(props) {
    super(props);
    this.views = ["day", "week", "month", "year"];
    this.handleViewBySelected = this.handleViewBySelected.bind(this);
  }

  handleViewBySelected(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      this.props.onClose();
      this.props.onViewBySelected(clicked.dataset.option);
    }
  }

  render() {
    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        buttonRef={this.props.buttonRef}
      >
        <ul onClick={this.handleViewBySelected}>
          {this.views.map((view) => {
            return (
              <li>
                <button
                  data-option={view}
                  className="w-[250px] flex justify-between items-center gap-10 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                >
                  <div className="flex items-center gap-4 capitalize">
                    <span className="w-[20px] text-lg font-bold">
                      {view.slice(0, 1)}
                    </span>
                    {view}
                  </div>
                  {this.props.view === view && (
                    <Check className="text-blue-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </FloatingWindow>
    );
  }
}

export default ViewByWindow;

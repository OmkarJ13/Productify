import { Check } from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";

class ViewByWindow extends React.Component {
  constructor(props) {
    super(props);
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
        anchorEl={this.props.anchorEl}
      >
        <ul onClick={this.handleViewBySelected}>
          <li>
            <button
              data-option="day"
              className="w-[250px] flex justify-between items-center gap-10 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="w-[20px] text-lg font-bold">D</span>
                Day
              </div>
              {this.props.view === "day" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="week"
              className="w-[250px] flex justify-between items-center gap-10 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="w-[20px] text-lg font-bold">W</span>
                Week
              </div>
              {this.props.view === "week" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="month"
              className="w-[250px] flex justify-between items-center gap-10 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="w-[20px] text-lg font-bold">M</span>
                Month
              </div>
              {this.props.view === "month" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="year"
              className="w-[250px] flex justify-between items-center gap-10 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="w-[20px] text-lg font-bold">Y</span>
                Year
              </div>
              {this.props.view === "year" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
        </ul>
      </FloatingWindow>
    );
  }
}

export default ViewByWindow;

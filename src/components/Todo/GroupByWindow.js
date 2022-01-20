import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Task,
  TrendingUp,
  Check,
  Error,
} from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";

class GroupByWindow extends React.Component {
  constructor(props) {
    super(props);
    this.handleGroupBySelected = this.handleGroupBySelected.bind(this);
  }

  handleGroupBySelected(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      this.props.onClose();
      this.props.onGroupBySelected(clicked.dataset.option);
    }
  }

  render() {
    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        anchorEl={this.props.anchorEl}
      >
        <ul onClick={this.handleGroupBySelected}>
          <li>
            <button
              data-option="task"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <Task fontSize="small" />
                Task
              </div>
              {this.props.group === "task" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="tag"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <LocalOffer fontSize="small" />
                Tag
              </div>
              {this.props.group === "tag" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="isProductive"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <TrendingUp fontSize="small" />
                Productive
              </div>
              {this.props.group === "isProductive" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="isBillable"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <AttachMoney fontSize="small" />
                Billable
              </div>
              {this.props.group === "isBillable" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="dueDate"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <CalendarToday fontSize="small" />
                Due Date
              </div>
              {this.props.group === "date" && (
                <span className="text-blue-500">
                  <Check />
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              data-option="dueDate"
              className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <div className="flex items-center gap-4">
                <Error fontSize="small" />
                Priority
              </div>
              {this.props.group === "date" && (
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

export default GroupByWindow;

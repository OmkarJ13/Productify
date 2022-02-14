import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Check,
  Note,
} from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";

class GroupByWindow extends React.Component {
  constructor(props) {
    super(props);
    this.groups = ["task", "tag", "isBillable", "date"];
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
        buttonRef={this.props.buttonRef}
      >
        <ul onClick={this.handleGroupBySelected}>
          {this.groups.map((group) => {
            return (
              <li>
                <button
                  data-option={group}
                  className="flex w-[250px] items-center justify-between gap-4 bg-white px-6 py-2 text-left text-gray-600 hover:bg-gray-200"
                >
                  <div className="flex items-center gap-4">
                    {group === "task" && (
                      <>
                        <Note /> Task
                      </>
                    )}
                    {group === "tag" && (
                      <>
                        <LocalOffer /> Tag
                      </>
                    )}
                    {group === "isBillable" && (
                      <>
                        <AttachMoney /> Is Billable
                      </>
                    )}
                    {group === "date" && (
                      <>
                        <CalendarToday /> Date
                      </>
                    )}
                  </div>
                  {this.props.group === group && (
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

export default GroupByWindow;

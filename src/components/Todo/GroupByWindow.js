import {
  AttachMoney,
  CalendarToday,
  LocalOffer,
  Task,
  Check,
  Error,
  Note,
} from "@mui/icons-material";
import React from "react";

import FloatingWindow from "../UI/FloatingWindow";

class GroupByWindow extends React.Component {
  constructor(props) {
    super(props);
    this.groups = ["task", "tag", "isBillable", "date", "priority", "isDone"];

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
          {this.groups.map((group) => {
            return (
              <li>
                <button
                  data-option={group}
                  className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                >
                  <div className="flex items-center gap-4">
                    {group === "task" && (
                      <>
                        <Note />
                        Task
                      </>
                    )}
                    {group === "tag" && (
                      <>
                        <LocalOffer />
                        Tag
                      </>
                    )}
                    {group === "isBillable" && (
                      <>
                        <AttachMoney />
                        Is Billable
                      </>
                    )}
                    {group === "date" && (
                      <>
                        <CalendarToday />
                        Date
                      </>
                    )}
                    {group === "priority" && (
                      <>
                        <Error />
                        Priority
                      </>
                    )}
                    {group === "isDone" && (
                      <>
                        <Task />
                        Status
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

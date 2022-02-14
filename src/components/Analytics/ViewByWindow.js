import { Alarm, AttachMoney, Task, Check } from "@mui/icons-material";
import React from "react";
import FloatingWindow from "../UI/FloatingWindow";

class ViewByWindow extends React.Component {
  constructor(props) {
    super(props);
    this.views = ["trackedHours", "tasksDone", "revenueEarned"];
    this.handleViewBySelected = this.handleViewBySelected.bind(this);
  }

  handleViewBySelected(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      this.props.onViewBySelected(clicked.dataset.option);
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
        <ul onClick={this.handleViewBySelected}>
          {this.views.map((view) => {
            return (
              <li>
                <button
                  data-option={view}
                  className="w-[250px] flex justify-between items-center gap-4 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
                >
                  <div className="flex items-center gap-4">
                    {view === "trackedHours" && (
                      <>
                        <Alarm /> Tracked Hours
                      </>
                    )}
                    {view === "tasksDone" && (
                      <>
                        <Task /> Tasks Done
                      </>
                    )}
                    {view === "revenueEarned" && (
                      <>
                        <AttachMoney /> Revenue Earned
                      </>
                    )}
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

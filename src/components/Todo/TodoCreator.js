import React from "react";

import { CalendarToday } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";

import TagSelector from "../Tag/TagSelector";
import PrioritySelector from "./PrioritySelector";

class TodoCreator extends React.Component {
  render() {
    const { task, tag, priority, dueDate } = this.props.todo;

    return (
      <div className="w-full flex items-center gap-4 p-4 shadow-md border border-gray-200 text-sm">
        <div className="w-[90%] h-full flex items-center">
          <input
            type="text"
            value={task}
            className="w-[50%] p-2 border border-gray-300 focus:outline-none"
            placeholder="Enter Task Name..."
            onChange={this.props.onTaskChanged}
          />

          <TagSelector
            className="w-[15%] h-full border-r border-dotted border-gray-300"
            initialTag={tag}
            onTagSelected={this.props.onTagSelected}
          />

          <PrioritySelector
            className="w-[15%] h-full border-r border-dotted border-gray-300"
            initialPriority={priority}
            onPrioritySelected={this.props.onPrioritySelected}
          />

          <div className="w-[20%] flex justify-center items-center gap-3">
            <span>Due</span>
            <button>
              <ReactDatePicker
                title="Change Date"
                selected={dueDate.toJSDate()}
                popperPlacement="bottom"
                minDate={DateTime.now().toJSDate()}
                customInput={
                  <div className="p-1 flex gap-2 items-center border border-gray-300">
                    <span className="capitalize">
                      {dueDate.diffNow().as("days") > 1
                        ? dueDate.toLocaleString(DateTime.DATE_MED)
                        : dueDate.toRelativeCalendar()}
                    </span>
                    <CalendarToday />
                  </div>
                }
                onChange={this.props.onDueDateChanged}
              />
            </button>
          </div>
        </div>
        <div className="w-[10%] h-full">
          <button
            className="w-full px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
            onClick={this.createTodo}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}

export default TodoCreator;

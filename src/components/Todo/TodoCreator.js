import React from "react";
import { DateTimePicker } from "@mui/lab";
import { Add, CalendarToday } from "@mui/icons-material";

import TagSelector from "../Tag/TagSelector";
import PrioritySelector from "./PrioritySelector";
import MUIPickerHandler from "../UI/MUIPickerHandler";

class TodoCreator extends React.Component {
  render() {
    const { task, tag, priority, dueDate } = this.props.todo;

    return (
      <div className="w-full h-[75px] flex items-center gap-4 p-4 shadow-md border border-gray-200 text-sm">
        <div className="flex-grow h-full flex items-center">
          <input
            type="text"
            value={task}
            className="flex-grow p-2 border border-gray-300 focus:outline-none"
            placeholder="What are you planning to do?"
            onChange={this.props.onTaskChanged}
          />

          <TagSelector
            className="w-[150px] h-full px-4 border-r border-dotted border-gray-300"
            initialTag={tag}
            onTagSelected={this.props.onTagSelected}
          />

          <PrioritySelector
            className="w-[150px] h-full border-r border-dotted border-gray-300"
            initialPriority={priority}
            onPrioritySelected={this.props.onPrioritySelected}
          />

          <MUIPickerHandler
            renderPicker={(otherProps) => {
              return (
                <DateTimePicker
                  {...otherProps}
                  value={dueDate.toJSDate()}
                  onChange={this.props.onDueDateChanged}
                  showToolbar={false}
                  renderInput={({ inputRef, InputProps }) => {
                    return (
                      <button
                        ref={inputRef}
                        onClick={InputProps.onClick}
                        className="w-[250px] mx-4 p-2 flex justify-between items-center gap-2 border border-gray-300"
                      >
                        <div className="flex-grow flex justify-center items-baseline gap-1 capitalize">
                          Due
                          <span>{dueDate.toRelativeCalendar()}</span>
                          On
                          <span>{dueDate.toFormat("HH:mm")}</span>
                        </div>
                        <CalendarToday fontSize="small" />
                      </button>
                    );
                  }}
                />
              );
            }}
          />
        </div>

        <div className="h-full flex items-center">
          <button
            className="w-full p-2 rounded-[50%] bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
            onClick={this.createTodo}
          >
            <Add />
          </button>
        </div>
      </div>
    );
  }
}

export default TodoCreator;

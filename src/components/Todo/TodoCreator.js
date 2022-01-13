import React from "react";

import { Error, LocalOffer, CalendarToday } from "@mui/icons-material";
import ReactDatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

import TagSelector from "../Tag/TagSelector";
import PrioritySelector from "./PrioritySelector";
import { priorities } from "../../helpers/priorities";
import { todoActions } from "../../store/slices/todoSlice";

class TodoCreator extends React.Component {
  constructor(props) {
    super(props);
    this.createTodo = this.createTodo.bind(this);
  }

  getPriorityTitle(priority) {
    const priorityName = priorities[priority].name;
    const priorityStyles = priorities[priority].styles;

    return (
      <div
        className={`flex justify-center items-center gap-2 ${priorityStyles}`}
      >
        <Error />
        <span className="text-xs">{priorityName}</span>
      </div>
    );
  }

  createTodo() {
    const todo = {
      id: uuid(),
      ...this.props.todo,
    };

    this.props.addTodo(todo);
  }

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
          <button
            title="Select Tag"
            className="w-[15%] relative h-full border-r border-dotted border-gray-300"
            onClick={this.props.onTagSelectorOpened}
          >
            {this.props.selectingTag && (
              <TagSelector
                onClose={this.props.onTagSelectorClosed}
                onTagSelected={this.props.onTagChanged}
              />
            )}

            {tag === undefined ? (
              <div className="flex justify-center items-center gap-2">
                <LocalOffer />
                <span className="text-xs">Add Tag</span>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <LocalOffer htmlColor={tag.color} />
                <span className="text-xs">{tag.name}</span>
              </div>
            )}
          </button>
          <button
            className="w-[15%] relative h-full border-r border-dotted border-gray-300"
            onClick={this.props.onPrioritySelectorOpened}
          >
            {this.getPriorityTitle(priority)}
            {this.props.selectingPriority && (
              <PrioritySelector
                onClose={this.props.onPrioritySelectorClosed}
                onPrioritySelected={this.props.onPriorityChanged}
              />
            )}
          </button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (todo) => {
      dispatch(todoActions.create(todo));
    },
  };
};

export default connect(null, mapDispatchToProps)(TodoCreator);

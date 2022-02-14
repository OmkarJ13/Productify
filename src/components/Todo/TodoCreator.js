import {
  AddTask,
  AttachMoney,
  CalendarToday,
  MoneyOffCsred,
} from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { connect } from "react-redux";
import React from "react";

import { getRelativeDate } from "../../helpers/getRelativeDate";
import { addTodoAsync } from "../../store/slices/todoSlice";
import MUIPickerHandler from "../UI/MUIPickerHandler";
import PrioritySelector from "./PrioritySelector";
import TagSelector from "../Tag/TagSelector";

class TodoCreator extends React.Component {
  constructor(props) {
    super(props);
    this.createTodo = this.createTodo.bind(this);
  }

  createTodo(e) {
    const todo = {
      ...this.props.todo,
    };

    this.props.addTodo(todo);
    this.props.resetState();
  }

  render() {
    const { task, tag, priority, isBillable, date } = this.props.todo;

    return (
      <div className="flex h-[75px] w-full items-center border border-gray-200 p-4 text-sm shadow-md">
        <div className="flex h-full flex-grow-[2] items-center">
          <input
            type="text"
            value={task}
            className="flex-grow border border-gray-300 p-2 focus:outline-none"
            placeholder="What are you planning to do?"
            onChange={this.props.onTaskChanged}
          />

          <div className="mx-4 flex h-full w-[250px] items-center justify-center gap-4">
            <TagSelector
              className="h-full max-w-[125px]"
              value={tag}
              onChange={this.props.onTagSelected}
            />

            <PrioritySelector
              value={priority}
              onChange={this.props.onPrioritySelected}
            />
          </div>

          <button
            className={`h-full border-x border-gray-300 p-1 px-2 text-gray-500`}
            onClick={this.props.onBillableChanged}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>
        </div>

        <div className="flex h-full flex-grow items-center justify-end gap-4">
          <div className="flex flex-grow justify-center">
            <MUIPickerHandler
              renderPicker={(otherProps) => {
                return (
                  <DatePicker
                    {...otherProps}
                    value={date.toJSDate()}
                    disablePast
                    onChange={this.props.onDateChanged}
                    showToolbar={false}
                    renderInput={({ inputRef, InputProps }) => {
                      return (
                        <button
                          ref={inputRef}
                          onClick={InputProps.onClick}
                          className="flex w-[125px] items-center justify-between gap-2 border border-gray-300 p-2"
                        >
                          <span className="flex flex-grow justify-center capitalize">
                            {getRelativeDate(date, "day")}
                          </span>
                          <CalendarToday fontSize="small" />
                        </button>
                      );
                    }}
                  />
                );
              }}
            />
          </div>

          <button
            className="rounded-[50%] bg-gradient-to-br from-blue-500 to-blue-400 p-2 uppercase text-white"
            onClick={this.createTodo}
          >
            <AddTask />
          </button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: (todo) => {
      dispatch(addTodoAsync(todo));
    },
  };
};

export default connect(null, mapDispatchToProps)(TodoCreator);

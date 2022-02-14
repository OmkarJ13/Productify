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
import { addTodoAsync, todoActions } from "../../store/slices/todoSlice";
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
      <div className="w-full h-[75px] flex items-center p-4 shadow-md border border-gray-200 text-sm">
        <div className="flex-grow-[2] h-full flex items-center">
          <input
            type="text"
            value={task}
            className="flex-grow p-2 border border-gray-300 focus:outline-none"
            placeholder="What are you planning to do?"
            onChange={this.props.onTaskChanged}
          />

          <div className="w-[250px] h-full flex justify-center items-center gap-4 mx-4">
            <TagSelector
              className="max-w-[125px] h-full"
              value={tag}
              onChange={this.props.onTagSelected}
            />

            <PrioritySelector
              value={priority}
              onChange={this.props.onPrioritySelected}
            />
          </div>

          <button
            className={`h-full p-1 border-x border-gray-300 text-gray-500 px-2`}
            onClick={this.props.onBillableChanged}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>
        </div>

        <div className="flex-grow h-full flex justify-end items-center gap-4">
          <div className="flex-grow flex justify-center">
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
                          className="w-[125px] p-2 flex justify-between items-center gap-2 border border-gray-300"
                        >
                          <span className="flex-grow flex justify-center capitalize">
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
            className="p-2 rounded-[50%] bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase"
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

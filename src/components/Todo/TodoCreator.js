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
      <div className="flex w-full flex-wrap justify-center gap-4 border border-gray-200 p-2 shadow-md xs:justify-between xs:gap-2">
        <input
          type="text"
          value={task}
          className="w-full border border-gray-300 p-2 focus:outline-none"
          placeholder="What are you planning to do?"
          onChange={this.props.onTaskChanged}
        />

        <div className="flex items-center gap-2 sm:gap-4">
          <TagSelector
            className="max-w-[125px]"
            value={tag}
            onChange={this.props.onTagSelected}
          />

          <PrioritySelector
            value={priority}
            onChange={this.props.onPrioritySelected}
          />
        </div>

        <div className="flex w-full items-center justify-between gap-2 xs:w-fit xs:flex-grow xs:justify-end sm:gap-4">
          <button
            className="border-x border-gray-300 py-1 px-2 text-gray-500"
            onClick={this.props.onBillableChanged}
          >
            {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
          </button>

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
                        className="flex w-[130px] items-center justify-between gap-2 border border-gray-300 p-2"
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

          <button
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-blue-500 p-2 uppercase text-white"
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

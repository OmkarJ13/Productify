import {
  AttachMoney,
  CalendarToday,
  Check,
  PlayArrow,
  Stop,
  MoneyOffCsred,
  Save,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { DatePicker } from "@mui/lab";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { DateTime } from "luxon";
import { Duration } from "luxon";
import React from "react";

import TimerEntryOptionsSelector from "../TimeTracker/TimerEntryOptionsSelector";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import { addTimerEntryAsync } from "../../store/slices/timerEntrySlice";
import { startTimerAsync, stopTimerAsync } from "../../store/slices/timerSlice";
import {
  addTodoAsync,
  deleteTodoAsync,
  updateTodoAsync,
} from "../../store/slices/todoSlice";
import TagSelector from "../Tag/TagSelector";
import MUIPickerHandler from "../UI/MUIPickerHandler";
import PrioritySelector from "./PrioritySelector";
import TodoTracker from "./TodoTracker";

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.saveTimerID = undefined;

    this.deleteTodo = this.deleteTodo.bind(this);
    this.duplicateTodo = this.duplicateTodo.bind(this);
    this.startTrackingTodo = this.startTrackingTodo.bind(this);
    this.stopTrackingTodo = this.stopTrackingTodo.bind(this);
    this.manualTrackTodo = this.manualTrackTodo.bind(this);
    this.handleIsDone = this.handleIsDone.bind(this);
  }

  startTrackingTodo() {
    const { id, task, tag, isBillable, date, ...otherData } = this.props.todo;

    const timer = {
      timerRef: id,
      task,
      tag,
      isBillable,
      date,
      startTime: DateTime.now(),
      endTime: DateTime.now(),
      duration: Duration.fromMillis(0),
    };

    this.props.startTodoTimer(timer);
    this.props.history.push("/track");
  }

  stopTrackingTodo() {
    if (!this.props.timer?.timerRef === this.props.todo.id) return;

    const { id, timerRef, ...otherData } = this.props.timer;

    const timerEntry = {
      ...otherData,
      endTime: DateTime.now(),
      duration: DateTime.now().diff(otherData.startTime),
    };

    this.props.stopTodoTimer(this.props.timer);
    this.props.createTimerEntry(timerEntry);
  }

  manualTrackTodo(data) {
    const { task, tag, isBillable, date, ...otherData } = this.props.todo;
    const { startTime, endTime } = data;

    const timerEntry = {
      task,
      tag,
      isBillable,
      date,
      startTime,
      endTime,
      duration: endTime.diff(startTime),
    };

    this.props.createTimerEntry(timerEntry);
  }

  duplicateTodo() {
    const { id, ...todoData } = this.props.todo;

    const duplicatedTodo = {
      ...todoData,
    };

    this.props.duplicateTodo(duplicatedTodo);
  }

  deleteTodo() {
    const { todo } = this.props;
    this.props.deleteTodo(todo);
  }

  setSaveTimer() {
    if (this.saveTimerID !== undefined) {
      clearTimeout(this.saveTimerID);
    }

    this.saveTimerID = setTimeout(() => {
      this.saveEditedChanges();
    }, 2000);
  }

  saveEditedChanges() {
    this.props.updateTodo(this.props.todo);

    toast(() => {
      return (
        <div className="flex items-center gap-4">
          <Save /> Successfully Saved Changes!
        </div>
      );
    });
  }

  hasMadeChanges(prevProps) {
    return JSON.stringify(prevProps.todo) !== JSON.stringify(this.props.todo);
  }

  componentDidUpdate(prevProps) {
    if (this.hasMadeChanges(prevProps)) {
      this.setSaveTimer();
    }
  }

  handleIsDone() {
    if (this.props.timer?.timerRef === this.props.todo.id) {
      this.stopTrackingTodo(this.props.timer);
    }

    this.props.onDoneChanged();
  }

  render() {
    const { id, isDone, task, tag, isBillable, priority, date } =
      this.props.todo;

    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          toastClassName={
            "bg-white text-gray-600 font-inter rounded-none border shadow-md border-gray-200"
          }
          hideProgressBar={true}
        />

        <div className="group flex w-full flex-wrap gap-2 border-x border-b border-gray-300 p-2">
          <div className="flex w-full items-center gap-2">
            <button
              onClick={this.handleIsDone}
              className={`h-[30px] w-[30px] border border-gray-300 text-white transition-colors ${
                isDone && "border-blue-500 bg-blue-500"
              }`}
            >
              {isDone ? <Check /> : null}
            </button>

            <input
              type="text"
              name="task"
              value={task}
              placeholder="Add Task Name"
              autoComplete="off"
              onChange={this.props.onTaskChanged}
              className="flex-grow text-ellipsis border border-gray-300 p-1 focus:outline-none"
            />
          </div>

          <div className="flex flex-grow items-center justify-start gap-2 sm:gap-4">
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

          <div className="flex flex-grow items-center justify-end gap-2 sm:gap-4">
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
                    onChange={this.props.onDateChanged}
                    disablePast
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

            {this.props.timer?.timerRef === id ? (
              <button
                className="flex animate-pulse items-center justify-center rounded-[50%] bg-red-500 text-white"
                onClick={this.stopTrackingTodo}
              >
                <Stop fontSize="small" />
              </button>
            ) : (
              <TodoTracker
                className="flex items-center justify-center rounded-[50%] bg-blue-500 text-white disabled:bg-gray-600"
                disabled={isDone}
                onStartTracking={this.startTrackingTodo}
                onManualTimeEntered={this.manualTrackTodo}
              >
                <PlayArrow fontSize="small" />
              </TodoTracker>
            )}

            <TimerEntryOptionsSelector
              onDuplicate={this.duplicateTodo}
              onDelete={this.deleteTodo}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timer: state.timerReducer.timer,
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTodo: (todo) => {
      dispatch(deleteTodoAsync(todo));
    },

    duplicateTodo: (todo) => {
      dispatch(addTodoAsync(todo));
    },

    updateTodo: (todo) => {
      dispatch(updateTodoAsync(todo));
    },

    startTodoTimer: (timer) => {
      dispatch(startTimerAsync(timer));
    },

    stopTodoTimer: (timer) => {
      dispatch(stopTimerAsync(timer));
    },

    createTimerEntry: (timer) => {
      dispatch(addTimerEntryAsync(timer));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Todo));

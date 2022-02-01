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
import { v4 as uuid } from "uuid";
import { DateTime } from "luxon";
import { Duration } from "luxon";
import React from "react";

import TimerEntryOptionsSelector from "../TimeTracker/TimerEntryOptionsSelector";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import { timerEntryActions } from "../../store/slices/timerEntrySlice";
import { currentTimerActions } from "../../store/slices/currentTimerSlice";
import { todoActions } from "../../store/slices/todoSlice";
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
    const { id, task, tag, isBillable, date, ...otherProps } = this.props.todo;

    const timer = {
      id,
      task,
      tag,
      isBillable,
      date,
      startTime: DateTime.now(),
      duration: Duration.fromMillis(0),
    };

    this.props.startTodoTimer(timer);
    this.props.history.push("/track");
  }

  stopTrackingTodo() {
    if (!this.props.currentTimer?.id === this.props.todo.id) return;

    const { task, tag, isBillable, date, startTime } = this.props.currentTimer;
    const timer = {
      id: uuid(),
      task,
      tag,
      isBillable,
      date,
      startTime,
      endTime: DateTime.now(),
      duration: DateTime.now().diff(startTime),
    };

    this.props.stopTodoTimer();
    this.props.createTimerEntry(timer);

    localStorage.setItem("currentTimer", JSON.stringify(null));
    localStorage.setItem(
      "timerEntries",
      JSON.stringify([timer, this.props.timerEntries])
    );
  }

  manualTrackTodo(data) {
    const { task, tag, isBillable, date, ...otherProps } = this.props.todo;
    const { startTime, endTime } = data;

    const timer = {
      id: uuid(),
      task,
      tag,
      isBillable,
      date,
      startTime,
      endTime,
      duration: endTime.diff(startTime),
    };

    this.props.createTimerEntry(timer);
    localStorage.setItem(
      "timerEntries",
      JSON.stringify([timer, this.props.timerEntries])
    );
  }

  getDueTime(duration) {
    const diff = duration.diffNow(["days", "hours", "minutes"]);

    const days = Math.floor(diff.days);
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);

    const dayString = days !== 0 ? Math.abs(days) + "d" : "";
    const hourString = hours !== 0 || days !== 0 ? Math.abs(hours) + "h" : "";
    const minuteString = minutes !== 0 ? Math.abs(minutes) + "m" : "";

    return days >= 0 && hours >= 0 && minutes >= 0
      ? `Due In ${dayString} ${hourString} ${minuteString}`
      : `Due ${dayString} ${hourString} ${minuteString} Ago`;
  }

  duplicateTodo() {
    const { todo } = this.props;

    const duplicatedTodo = {
      ...todo,
      id: uuid(),
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
    if (this.props.currentTimer?.id === this.props.todo.id)
      this.stopTrackingTodo();
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

        <div className="group w-full h-[65px] flex items-center p-4 border-x border-b border-gray-300 text-sm">
          <div className="flex-grow-[2] h-full flex items-center">
            <button
              onClick={this.handleIsDone}
              className={`transition-colors w-[30px] h-[30px] mr-4 border border-gray-300 text-white ${
                isDone && "bg-blue-500 border-blue-500"
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
              className="transition-colors flex-grow p-1 border border-transparent group-hover:border-gray-300 focus:outline-none text-ellipsis"
            />

            <div className="w-[250px] flex justify-center items-center gap-4 mx-4">
              <TagSelector
                className="transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 max-w-[125px] h-full flex justify-center items-center"
                value={tag}
                onChange={this.props.onTagSelected}
              />

              <PrioritySelector
                className="transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                value={priority}
                onChange={this.props.onPrioritySelected}
              />
            </div>

            <button
              className={`transition-opacity opacity-0 group-hover:opacity-100 p-1 h-full border-x border-gray-300 text-gray-500 px-2`}
              onClick={this.props.onBillableChanged}
            >
              {isBillable ? <AttachMoney /> : <MoneyOffCsred />}
            </button>

            <div className="flex-grow flex justify-center">
              <MUIPickerHandler
                renderPicker={(otherProps) => {
                  return (
                    <DatePicker
                      {...otherProps}
                      value={date.toJSDate()}
                      onChange={this.props.onDateChanged}
                      showToolbar={false}
                      renderInput={({ inputRef, InputProps }) => {
                        return (
                          <button
                            ref={inputRef}
                            onClick={InputProps.onClick}
                            className="w-[125px] flex justify-center items-center gap-2 p-1 transition-opacity opacity-0 group-hover:opacity-100 capitalize border border-gray-300"
                          >
                            <span className="text-center flex-grow">
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
          </div>

          <div className="h-full flex justify-end items-center gap-2">
            {this.props.currentTimer?.id === id ? (
              <button
                className="flex justify-center items-center text-white rounded-[50%] bg-red-500 animate-pulse"
                onClick={this.stopTrackingTodo}
              >
                <Stop fontSize="small" />
              </button>
            ) : (
              <TodoTracker
                className="flex justify-center items-center disabled:bg-gray-600 text-white rounded-[50%] bg-blue-500"
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
    currentTimer: state.currentTimerReducer.currentTimer,
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTodo: (todo) => {
      dispatch(todoActions.delete(todo));
    },

    duplicateTodo: (todo) => {
      dispatch(todoActions.create(todo));
    },

    updateTodo: (todo) => {
      dispatch(todoActions.update(todo));
    },

    startTodoTimer: (timer) => {
      dispatch(currentTimerActions.start(timer));
    },

    stopTodoTimer: () => {
      dispatch(currentTimerActions.stop());
    },

    createTimerEntry: (timer) => {
      dispatch(timerEntryActions.create(timer));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Todo));

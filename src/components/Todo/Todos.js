import { DateTime, Interval } from "luxon";
import { connect } from "react-redux";
import React from "react";

import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import { priorities } from "../../helpers/priorities";

import ViewBySelector from "../UI/ViewBySelector";
import GroupBySelector from "../UI/GroupBySelector";
import PeriodChanger from "../UI/PeriodChanger";
import GroupedData from "../UI/GroupedData";

import GroupByWindow from "./GroupByWindow";
import TodoStateManager from "./TodoStateManager";
import Todo from "./Todo";

class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("day"),
        DateTime.now().endOf("day")
      ),

      group: "date",
      view: "day",
    };

    this.periodChangeHandler = this.periodChangeHandler.bind(this);
    this.groupChangeHandler = this.groupChangeHandler.bind(this);
    this.viewChangeHandler = this.viewChangeHandler.bind(this);
  }

  periodChangeHandler(e) {
    this.setState({
      period: e,
    });
  }

  groupChangeHandler(e) {
    this.setState({
      group: e,
    });
  }

  viewChangeHandler(e) {
    this.setState({
      view: e,
    });
  }

  generateTodos(todos) {
    return todos.map((todo) => {
      return (
        <TodoStateManager
          key={todo.id}
          todo={todo}
          renderTodo={(otherProps) => {
            return <Todo {...otherProps} />;
          }}
        />
      );
    });
  }

  getTodos(todos) {
    const groupedTodos = groupTimerEntriesBy(todos, [this.state.group]);
    const sortedTodos = groupedTodos.sort((a, b) => {
      return a[0].date.toMillis() - b[0].date.toMillis();
    });

    const JSX = sortedTodos.map((todos) => {
      let heading = todos[0][this.state.group];
      switch (this.state.group) {
        case "priority":
          heading = priorities[heading].name;
          break;

        case "tag":
          heading = heading.name;
          break;

        case "isBillable":
          heading = heading ? "Billable" : "Non-Billable";
          break;

        case "isDone":
          heading = heading ? "Done" : "Due";
          break;

        case "date":
          heading = getRelativeDate(heading, "day");
          break;
      }

      const complete = todos.filter((todo) => todo.isDone);
      const data = this.generateTodos(todos);

      return (
        <GroupedData
          heading={heading}
          subHeading={`${complete.length}/${todos.length}`}
          data={data}
        />
      );
    });

    return JSX;
  }

  filterTodos(todos) {
    return todos.filter((todo) => {
      return this.state.period.contains(todo.date);
    });
  }

  generateEmptyMessage() {
    return <h3 className="m-auto text-2xl font-light">No Tasks To Do...</h3>;
  }

  componentDidUpdate() {
    this.storeTodos();
  }

  storeTodos() {
    localStorage.setItem("todos", JSON.stringify(this.props.todos));
  }

  render() {
    const { period, group, view } = this.state;
    const { todos } = this.props;

    const filteredTodos = this.filterTodos(todos);
    const finalTodos = this.getTodos(filteredTodos);

    const completedTodos = filteredTodos.filter((todo) => todo.isDone);
    const dueTodos = filteredTodos.filter((todo) => !todo.isDone);

    return (
      <div className="flex-grow w-full flex flex-col gap-8">
        <div className="w-full flex justify-between items-center">
          <div className="font-light flex gap-4">
            <span className="flex items-baseline gap-2">
              Completed
              <strong className="text-lg">{completedTodos.length}</strong>
            </span>
            <span className="flex items-baseline gap-2">
              Due <strong className="text-lg">{dueTodos.length}</strong>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <PeriodChanger
              unit={this.state.view}
              value={period}
              onChange={this.periodChangeHandler}
            />
            <GroupBySelector
              Window={GroupByWindow}
              value={group}
              onChange={this.groupChangeHandler}
            />
            <ViewBySelector value={view} onChange={this.viewChangeHandler} />
          </div>
        </div>
        <div className="w-full flex-grow flex flex-col gap-8">
          {finalTodos.length > 0 && finalTodos}
          {finalTodos.length === 0 && this.generateEmptyMessage()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todos,
  };
};

export default connect(mapStateToProps)(Todos);

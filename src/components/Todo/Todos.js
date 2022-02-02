import { DateTime, Interval } from "luxon";
import { CheckCircle } from "@mui/icons-material";
import { connect } from "react-redux";
import React from "react";

import { groupObjectArrayBy } from "../../helpers/groupObjectArrayBy";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import { priorities } from "../../helpers/priorities";

import ViewBySelector from "../UI/ViewBySelector";
import GroupBySelector from "../UI/GroupBySelector";
import PeriodChanger from "../UI/PeriodChanger";
import GroupedEntries from "../UI/GroupedEntries";
import NoData from "../UI/NoData";

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
      showDone: false,
    };

    this.periodChangeHandler = this.periodChangeHandler.bind(this);
    this.groupChangeHandler = this.groupChangeHandler.bind(this);
    this.viewChangeHandler = this.viewChangeHandler.bind(this);
    this.toggleShowDone = this.toggleShowDone.bind(this);
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

  toggleShowDone(e) {
    this.setState((prevState) => {
      return {
        showDone: !prevState.showDone,
      };
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

  getTag(id) {
    const { tags } = this.props;
    return tags.find((x) => x.id === id);
  }

  getTodos(todos) {
    const { showDone } = this.state;

    const filteredTodos = todos.filter((todo) =>
      showDone ? true : !todo.isDone
    );
    const groupedTodos = groupObjectArrayBy(filteredTodos, [this.state.group]);

    const sortedTodos = groupedTodos.sort((a, b) => {
      return a[0].date.toMillis() - b[0].date.toMillis();
    });

    const JSX = sortedTodos.map((todoGroup) => {
      let heading = todoGroup[0][this.state.group];
      switch (this.state.group) {
        case "priority":
          heading = priorities[heading].name;
          break;

        case "tag":
          heading = heading ? this.getTag(heading).name : "Untagged";
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
      const data = this.generateTodos(todoGroup);

      return (
        <GroupedEntries
          heading={heading}
          subHeading={`${complete.length}/${todos.length}`}
          data={data}
        />
      );
    });

    return JSX;
  }

  filterTodos(todos) {
    const filteredPeriod = todos.filter((todo) => {
      return this.state.period.contains(todo.date);
    });

    return filteredPeriod;
  }

  componentDidUpdate() {
    this.storeTodos();
  }

  storeTodos() {
    localStorage.setItem("todos", JSON.stringify(this.props.todos));
  }

  render() {
    const { period, group, view, showDone } = this.state;
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
            <button
              className="w-[120px] flex justify-center items-center gap-2"
              onClick={this.toggleShowDone}
            >
              <CheckCircle /> {showDone ? "Hide Done" : "Show Done"}
            </button>
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
          {finalTodos.length === 0 && <NoData text="No Tasks To Do" />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todos,
    tags: state.tagReducer.tags,
  };
};

export default connect(mapStateToProps)(Todos);

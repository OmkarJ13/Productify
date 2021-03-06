import { DateTime, Interval } from "luxon";
import { CheckCircle, Sync } from "@mui/icons-material";
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

      const complete = todoGroup.filter((todo) => todo.isDone);
      const data = this.generateTodos(todoGroup);

      return (
        <GroupedEntries
          heading={heading}
          subHeading={`${complete.length}/${todoGroup.length}`}
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

  render() {
    const { period, group, view, showDone } = this.state;
    const { todos } = this.props;

    const filteredTodos = this.filterTodos(todos);
    const finalTodos = this.getTodos(filteredTodos);

    const completedTodos = filteredTodos.filter((todo) => todo.isDone);
    const dueTodos = filteredTodos.filter((todo) => !todo.isDone);

    return (
      <div className="flex w-full flex-grow flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-baseline gap-2">
              Completed
              <span className="text-lg">{completedTodos.length}</span>
            </span>
            <span className="flex items-baseline gap-2">
              Due <span className="text-lg">{dueTodos.length}</span>
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:ml-auto lg:gap-6">
            <PeriodChanger
              unit={this.state.view}
              value={period}
              onChange={this.periodChangeHandler}
              className="w-full sm:w-fit"
            />

            <div className="flex items-center justify-between gap-2 sm:ml-auto sm:gap-4 lg:gap-6">
              <button
                className="flex items-center gap-1"
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
        </div>
        <div className="flex w-full flex-grow flex-col gap-8">
          {finalTodos.length > 0 && finalTodos}
          {finalTodos.length === 0 && this.props.loading && (
            <Sync
              className="m-auto animate-spin text-blue-500"
              fontSize="large"
            />
          )}
          {finalTodos.length === 0 && !this.props.loading && (
            <NoData text="No Tasks To Do" />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todos,
    loading: state.todoReducer.loading,
    tags: state.tagReducer.tags,
  };
};

export default connect(mapStateToProps)(Todos);

import React from "react";
import { connect } from "react-redux";

import ViewBySelector from "../UI/ViewBySelector";
import GroupBySelector from "../UI/GroupBySelector";
import GroupByWindow from "./GroupByWindow";
import PeriodChanger from "../UI/PeriodChanger";

class Todos extends React.Component {
  render() {
    return (
      <div className="w-full flex-grow">
        <div className="w-full flex justify-between items-center">
          <div className="font-light flex gap-4">
            <span className="flex items-baseline gap-2">
              Tasks Completed <strong className="text-lg">4</strong>
            </span>
            <span className="flex items-baseline gap-2">
              Tasks Due <strong className="text-lg">2</strong>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <PeriodChanger unit="day" />
            <GroupBySelector Window={GroupByWindow} />
            <ViewBySelector />
          </div>
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

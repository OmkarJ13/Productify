import React from "react";
import { connect } from "react-redux";
import "chart.js/auto";

import Stats from "./Stats";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import { groupObjectArrayBy } from "../../helpers/groupObjectArrayBy";
import { LocalOffer } from "@mui/icons-material";
import { Duration } from "luxon";
import CalendarChart from "./CalendarChart";
import NoData from "../UI/NoData";

class Analytics extends React.Component {
  componentDidMount() {
    document.title = "Analytics | Productify";
  }

  getDurationsForTags(tags) {
    let { timerEntries } = this.props;

    timerEntries = timerEntries.filter(
      (timerEntry) => timerEntry.tag !== undefined
    );

    const groupedTimerEntries = groupObjectArrayBy(timerEntries, ["tag"]);

    const durations = tags.map((tag) => {
      const entriesWithCurTag = groupedTimerEntries.find(
        (timerEntriesGroup) => timerEntriesGroup[0].tag === tag.id
      );

      if (entriesWithCurTag) {
        return entriesWithCurTag
          .reduce((acc, cur) => acc.plus(cur.duration), Duration.fromMillis(0))
          .as("hours");
      }

      return 0;
    });

    return durations;
  }

  getRevenueForTags(tags) {
    let { timerEntries } = this.props;

    timerEntries = timerEntries.filter(
      (timerEntry) => timerEntry.tag !== undefined
    );

    const groupedTimerEntries = groupObjectArrayBy(timerEntries, ["tag"]);

    const revenue = tags.map((tag) => {
      const entriesWithCurTag = groupedTimerEntries.find(
        (timerEntriesGroup) => timerEntriesGroup[0].tag === tag.id
      );

      if (entriesWithCurTag) {
        return entriesWithCurTag
          .filter((timerEntry) => timerEntry.isBillable)
          .reduce(
            (acc, cur) =>
              acc +
              cur.duration.as("hours") *
                tags.find((x) => x.id === cur.tag).billableAmount,
            0
          );
      }

      return 0;
    });

    return revenue;
  }

  getTasksDoneForTags(tags) {
    let { todos } = this.props;

    todos = todos.filter((todo) => todo.tag !== undefined);

    const groupedTodos = groupObjectArrayBy(todos, ["tag"]);

    const done = tags.map((tag) => {
      const todosWithCurTag =
        groupedTodos.find((todoGroup) => todoGroup[0].tag === tag.id) ?? [];

      if (todosWithCurTag) {
        return [
          todosWithCurTag.filter((todo) => todo.isDone).length,
          todosWithCurTag.length,
        ];
      }
    });

    return done;
  }

  render() {
    const { timerEntries, todos, tags } = this.props;

    const durationForTags = this.getDurationsForTags(tags);
    const revenueEarnedForTags = this.getRevenueForTags(tags);
    const tasksDoneForTags = this.getTasksDoneForTags(tags);

    return (
      <div className="w-[85%] min-h-screen ml-auto p-6 text-gray-600">
        <Stats timerEntries={timerEntries} todos={todos} tags={tags} />
        <div className="flex h-screen items-center gap-4 mt-6 border border-gray-300 rounded-md">
          <BarChart timerEntries={timerEntries} todos={todos} tags={tags} />
        </div>
        <div className="h-[75vh] flex gap-4 mt-6">
          <div className="w-[40%] h-full border border-gray-300 rounded-md">
            <DoughnutChart
              timerEntries={timerEntries}
              todos={todos}
              tags={tags}
            />
          </div>
          <div className="w-[60%] h-full flex flex-col border border-gray-300 rounded-md overflow-auto">
            {tags.length === 0 && <NoData text="No Tags To Display" />}
            {tags.length > 0 && (
              <div className="w-full h-full flex flex-col overflow-auto">
                <div className="p-4 flex items-center justify-between border-b border-gray-300">
                  <div className="w-[60%] flex items-center gap-4">
                    <LocalOffer />
                    <span>Name</span>
                  </div>
                  <div className="w-[40%] flex items-center gap-6">
                    <span className="w-1/3 text-center">Duration</span>
                    <span className="w-1/3 text-center">Revenue</span>
                    <span className="w-1/3 text-center">Tasks</span>
                  </div>
                </div>
                {tags.map((tag, i) => {
                  return (
                    <div className="p-4 flex items-center justify-between border-b border-gray-300 ">
                      <div className="w-[60%] flex items-center gap-4">
                        <LocalOffer htmlColor={tag.color} />
                        <span>{tag.name}</span>
                      </div>

                      <div className="w-[40%] flex items-center gap-6">
                        <span className="w-1/3 text-center">
                          {durationForTags[i].toFixed(1)}h
                        </span>
                        <span className="w-1/3 text-center">
                          {revenueEarnedForTags[i].toFixed(1)}$
                        </span>
                        <span className="w-1/3 text-center">
                          {tasksDoneForTags[i][0]} / {tasksDoneForTags[i][1]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 mt-6 border border-gray-300 rounded-md">
          <CalendarChart
            timerEntries={timerEntries}
            todos={todos}
            tags={tags}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timerEntries: state.timerEntryReducer.timerEntries,
    todos: state.todoReducer.todos,
    tags: state.tagReducer.tags,
  };
};

export default connect(mapStateToProps)(Analytics);

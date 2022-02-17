import React from "react";
import { Duration } from "luxon";
import { connect } from "react-redux";
import { LocalOffer } from "@mui/icons-material";
import "chart.js/auto";

import Stats from "./Stats";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import CalendarChart from "./CalendarChart";
import NoData from "../UI/NoData";

import { groupObjectArrayBy } from "../../helpers/groupObjectArrayBy";

class Analytics extends React.Component {
  componentDidMount() {
    document.title = "Analytics | Productify";
  }

  // Gets durations to show for tags
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

  // Gets revenue to show for tag
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

  // Gets todos done for tags
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
      <div className="mb-auto flex h-[90%] w-full flex-col gap-4 overflow-y-auto p-6 text-gray-600 xl:mb-0 xl:ml-auto xl:min-h-screen xl:w-[85%] xl:gap-6">
        <Stats timerEntries={timerEntries} todos={todos} tags={tags} />
        <div className="mt-6  rounded-md border border-gray-300">
          <BarChart timerEntries={timerEntries} todos={todos} tags={tags} />
        </div>
        <div className="mt-6 flex flex-col gap-4 lg:flex-row">
          <div className="h-[500px] rounded-md border border-gray-300 lg:w-[40%]">
            <DoughnutChart
              timerEntries={timerEntries}
              todos={todos}
              tags={tags}
            />
          </div>
          <div className="flex max-h-[500px] w-full flex-col overflow-auto rounded-md border border-gray-300 py-4 lg:h-full lg:w-[60%]">
            {tags.length === 0 && <NoData text="No Tags To Display" />}
            {tags.length > 0 && (
              <div className="flex h-full min-w-fit flex-col">
                <div className="flex items-center justify-between gap-12 border-b border-gray-300 p-2 sm:p-4">
                  <div className="flex items-center gap-4">
                    <LocalOffer />
                    <span className="w-[200px] overflow-clip text-ellipsis">
                      Name
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="w-[100px] text-center">Duration</span>
                    <span className="w-[100px] text-center">Revenue</span>
                    <span className="w-[100px] text-center">Tasks</span>
                  </div>
                </div>
                {tags.map((tag, i) => {
                  return (
                    <div className="flex items-center justify-between gap-12 border-b border-gray-300 p-2 sm:p-4 ">
                      <div className="flex items-center gap-4">
                        <LocalOffer htmlColor={tag.color} />
                        <span className="w-[200px] overflow-clip text-ellipsis">
                          {tag.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="w-[100px] text-center">
                          {durationForTags[i].toFixed(1)}h
                        </span>
                        <span className="w-[100px] text-center">
                          {revenueEarnedForTags[i].toFixed(1)}$
                        </span>
                        <span className="w-[100px] text-center">
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

        <div className="mt-6 rounded-md border border-gray-300 p-4">
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

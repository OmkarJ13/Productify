import React from "react";
import { connect } from "react-redux";

import { v4 as uuid } from "uuid";
import { Duration } from "luxon";
import { DateTime } from "luxon";
import { Interval } from "luxon";

import { groupTimerEntriesBy } from "../../helpers/groupTimerEntriesBy";
import { getRelativeDate } from "../../helpers/getRelativeDate";
import TimerEntry from "./TimerEntry";
import TimerEntryStateManager from "./TimerEntryStateManager";
import GroupByWindow from "../TimeTracker/GroupByWindow";
import GroupBySelector from "../UI/GroupBySelector";
import ViewBySelector from "../UI/ViewBySelector";
import GroupedData from "../UI/GroupedData";
import PeriodChanger from "../UI/PeriodChanger";

class TimerEntries extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      period: Interval.fromDateTimes(
        DateTime.now().startOf("week"),
        DateTime.now().endOf("week")
      ),
      group: "date",
      view: "week",
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
    this.handleGroupChanged = this.handleGroupChanged.bind(this);
    this.handleViewChanged = this.handleViewChanged.bind(this);
  }

  handlePeriodChanged(e) {
    this.setState({
      period: e,
    });
  }

  handleGroupChanged(e) {
    this.setState({
      group: e,
    });
  }

  handleViewChanged(e) {
    this.setState({
      view: e,
    });
  }

  getTotal(timerEntries) {
    return timerEntries.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));
  }

  getCombinedTimerEntry(timerEntries) {
    const allStartTimes = timerEntries.map((cur) => cur.startTime);
    const minStartTime = DateTime.min(...allStartTimes);

    const allEndTimes = timerEntries.map((cur) => cur.endTime);
    const maxEndTime = DateTime.max(...allEndTimes);

    // Get all the durations
    const totalDuration = timerEntries.reduce((acc, cur) => {
      return acc.plus(cur.duration);
    }, Duration.fromMillis(0));

    const combinedTimerEntry = {
      id: uuid(),
      task: timerEntries[0].task,
      date: timerEntries[0].date,
      duration: totalDuration,
      startTime: minStartTime,
      endTime: maxEndTime,
      tag: timerEntries[0].tag,
      isProductive: timerEntries[0].isProductive,
      isBillable: timerEntries[0].isBillable,
      allEntries: this.generateTimerEntries(timerEntries, true),
    };

    return combinedTimerEntry;
  }

  getTimerEntries(timerEntries) {
    const groupedByGroup = groupTimerEntriesBy(timerEntries, [
      this.state.group,
    ]);

    const sortedRecent = groupedByGroup.sort((a, b) => {
      return b[0].date.toMillis() - a[0].date.toMillis();
    });

    const groupedFinal = sortedRecent.map((groupedByGroup) =>
      groupTimerEntriesBy(groupedByGroup, [
        "task",
        "tag",
        "isProductive",
        "isBillable",
        "date",
      ])
    );

    const combined = groupedFinal.map((groupedByGroup) => {
      return groupedByGroup.map((groupedByDuplicates) => {
        if (groupedByDuplicates.length === 1) {
          return groupedByDuplicates[0];
        } else {
          return this.getCombinedTimerEntry(groupedByDuplicates);
        }
      });
    });

    const JSX = combined.map((timerEntriesGrouped) => {
      let heading = timerEntriesGrouped[0][this.state.group];
      switch (this.state.group) {
        case "tag":
          heading = heading.name;
          break;

        case "isProductive":
          heading = heading ? "Productive" : "Unproductive";
          break;

        case "isBillable":
          heading = heading ? "Billable" : "Non-billable";
          break;

        case "date":
          heading = getRelativeDate(heading, "day");
          break;
      }

      const totalDuration = timerEntriesGrouped.reduce((acc, cur) => {
        return acc.plus(cur.duration);
      }, Duration.fromMillis(0));

      const timerEntries = this.generateTimerEntries(timerEntriesGrouped);

      return (
        <GroupedData
          heading={heading}
          subHeading={totalDuration.toFormat("hh:mm:ss")}
          data={timerEntries}
        />
      );
    });

    return JSX;
  }

  generateTimerEntries(timerEntries, isDuplicates = false) {
    return timerEntries.map((timerEntry) => {
      return (
        <TimerEntryStateManager
          key={timerEntry.id}
          timerEntry={{
            id: timerEntry.id,
            task: timerEntry.task,
            tag: timerEntry.tag,
            duration: timerEntry.duration,
            date: timerEntry.date,
            startTime: timerEntry.startTime,
            endTime: timerEntry.endTime,
            isProductive: timerEntry.isProductive,
            isBillable: timerEntry.isBillable,
          }}
          renderTimerEntry={(otherProps) => {
            return (
              <TimerEntry
                allEntries={timerEntry.allEntries}
                isDuplicate={isDuplicates}
                {...otherProps}
              />
            );
          }}
        />
      );
    });
  }

  generateEmptyMessage() {
    return <h3 className="m-auto text-2xl font-light">No Time Tracked...</h3>;
  }

  filterEntries(timerEntries) {
    return timerEntries.filter((timerEntry) =>
      this.state.period.contains(timerEntry.date)
    );
  }

  render() {
    const filteredEntries = this.filterEntries(this.props.timerEntries);
    const filteredTotal = this.getTotal(filteredEntries);

    const timerEntries = this.getTimerEntries(filteredEntries);

    return (
      <div className="w-full flex-grow flex flex-col gap-8">
        <div className="w-full flex justify-between items-center">
          <span className="flex items-baseline gap-2 text-base">
            Time Tracked
            <span className="text-lg">
              {filteredTotal.toFormat("h'h' m'm'")}
            </span>
          </span>

          <div className="flex items-center gap-8">
            <PeriodChanger
              unit={this.state.view}
              value={this.state.period}
              onChange={this.handlePeriodChanged}
            />

            <GroupBySelector
              Window={GroupByWindow}
              value={this.state.group}
              onChange={this.handleGroupChanged}
            />
            <ViewBySelector
              value={this.state.view}
              onChange={this.handleViewChanged}
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-8">
          {timerEntries.length > 0 && timerEntries}
          {timerEntries.length === 0 && this.generateEmptyMessage()}
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.storeTimerEntries();
  }

  storeTimerEntries() {
    localStorage.setItem(
      "timerEntries",
      JSON.stringify(this.props.timerEntries)
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

export default connect(mapStateToProps)(TimerEntries);

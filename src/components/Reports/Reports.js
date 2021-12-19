import React from "react";

import { parseTimerEntriesJSON } from "../../helpers/parseTimerEntriesJSON";
import { getWeekByDate } from "../../helpers/getWeekByDate";
import { getNextDate, getPrevDate } from "../../helpers/getDate";

import DailyDistributionChart from "./DailyDistributionChart";
import WeeklyGraph from "./WeeklyGraph";
import YearlyGraph from "./YearlyGraph";

class Reports extends React.Component {
  constructor(props) {
    super(props);

    const today = new Date();
    const week = getWeekByDate(today);
    const year = today.getFullYear();

    this.state = {
      date: today,
      week: week,
      year: year,
    };

    this.dateChangeHandler = this.dateChangeHandler.bind(this);
    this.weekChangeHandler = this.weekChangeHandler.bind(this);
    this.yearChangeHandler = this.yearChangeHandler.bind(this);
  }

  componentDidMount() {
    document.title = "Reports | Productify";
  }

  dateChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      date:
        btn.name === "plus"
          ? getNextDate(this.state.date)
          : getPrevDate(this.state.date),
    });
  }

  weekChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      week:
        btn.name === "plus"
          ? [
              getNextDate(this.state.week[0], 7),
              getNextDate(this.state.week[1], 7),
            ]
          : [
              getPrevDate(this.state.week[0], 7),
              getPrevDate(this.state.week[1], 7),
            ],
    });
  }

  yearChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      year: btn.name === "plus" ? this.state.year + 1 : this.state.year - 1,
    });
  }

  // Fetches and parses timer entries data from local storage
  getTimerEntryData() {
    const timerEntries = parseTimerEntriesJSON(
      localStorage.getItem("timerEntries")
    );

    return timerEntries;
  }

  render() {
    const timerEntryData = this.getTimerEntryData();

    return (
      <div className="w-4/5 min-h-screen flex flex-wrap ml-auto text-gray-600">
        <DailyDistributionChart
          timerEntryData={timerEntryData}
          date={this.state.date}
          dateChangeHandler={this.dateChangeHandler}
        />
        <WeeklyGraph
          timerEntryData={timerEntryData}
          week={this.state.week}
          weekChangeHandler={this.weekChangeHandler}
        />
        <YearlyGraph
          timerEntryData={timerEntryData}
          year={this.state.year}
          yearChangeHandler={this.yearChangeHandler}
        />
      </div>
    );
  }
}

export default Reports;

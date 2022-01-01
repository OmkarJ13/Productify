import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { DateTime } from "luxon";
import { Interval } from "luxon";

import DailyDistributionChart from "./DailyDistributionChart";
import WeeklyGraph from "./WeeklyGraph";
import YearlyGraph from "./YearlyGraph";
import { connect } from "react-redux";

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: DateTime.fromObject({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      week: Interval.fromDateTimes(
        DateTime.now().startOf("week"),
        DateTime.now().endOf("week")
      ),
      year: DateTime.now().year,
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
          ? this.state.date.plus({ days: 1 })
          : this.state.date.minus({ days: 1 }),
    });
  }

  weekChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      week:
        btn.name === "plus"
          ? this.state.week.mapEndpoints((endPoint) =>
              endPoint.plus({ week: 1 })
            )
          : this.state.week.mapEndpoints((endPoint) =>
              endPoint.minus({ week: 1 })
            ),
    });
  }

  yearChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      year: btn.name === "plus" ? this.state.year + 1 : this.state.year - 1,
    });
  }

  render() {
    const timerEntryData = this.props.timerEntries;

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

const mapStateToProps = (state) => {
  return {
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

export default connect(mapStateToProps)(Reports);

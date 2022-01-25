import React from "react";
import { connect } from "react-redux";

import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { DateTime } from "luxon";
import { Interval } from "luxon";

import DailyDistributionChart from "./DailyDistributionChart";
import WeeklyGraph from "./WeeklyGraph";
import YearlyGraph from "./YearlyGraph";

class Reports extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = "Reports | Productify";
  }

  render() {
    const timerEntryData = this.props.timerEntries;

    return (
      <div className="w-10/12 min-h-screen flex flex-wrap ml-auto text-gray-600">
        <DailyDistributionChart timerEntryData={timerEntryData} />
        <WeeklyGraph timerEntryData={timerEntryData} />
        <YearlyGraph timerEntryData={timerEntryData} />
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

import React from "react";

import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import Time from "../classes/Time";
import { groupTimerEntriesBy } from "../helpers/groupTimerEntriesBy";
import { parseTimerEntriesJSON } from "../helpers/parseTimerEntriesJSON";
import { getDaysPassed } from "../helpers/getDaysPassed";
import { colors } from "../helpers/colors";
import { getNextDate, getPrevDate } from "../helpers/getDate";
import { getWeekByDate } from "../helpers/getWeekByDate";
import {
  HOURS_IN_DAY,
  MILISECONDS_IN_SECOND,
  MINUTES_IN_HOUR,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "../constants/timeHelper";
import { mod } from "../helpers/mod";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

  getDailyTitle(date) {
    const presentDate = new Date();
    const yesterdayDate = getPrevDate(presentDate);

    if (date.toLocaleDateString() === presentDate.toLocaleDateString()) {
      return "Today";
    } else if (
      date.toLocaleDateString() === yesterdayDate.toLocaleDateString()
    ) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  }

  getWeeklyTitle(weekStart, weekEnd) {
    const presentDate = new Date();
    const lastWeekDate = getPrevDate(
      presentDate,
      mod(presentDate.getDay() - 1, 7) + 1
    );

    if (
      presentDate.getTime() > weekStart.getTime() &&
      presentDate.getTime() < weekEnd.getTime()
    ) {
      return "This Week";
    } else if (
      lastWeekDate.getTime() > weekStart.getTime() &&
      lastWeekDate.getTime() < weekEnd.getTime()
    ) {
      return "Last Week";
    }
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  }

  getYearlyTitle(year) {
    const presentYear = new Date().getFullYear();

    if (year === presentYear) {
      return "This Year";
    } else if (year === presentYear - 1) {
      return "Last Year";
    }

    return year;
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

  // Returns the number of hours tracked for each day in a given week
  getWeeklyData(timerEntries, weekStart, weekEnd) {
    if (!timerEntries) return [];

    const timerEntriesFiltered = timerEntries.filter((timerEntry) => {
      const ms = new Date(timerEntry.date);
      return ms > weekStart.getTime() && ms < weekEnd.getTime();
    });

    const timerEntriesSorted = timerEntriesFiltered.sort((a, b) => {
      return getDaysPassed(b.date) - getDaysPassed(a.date);
    });

    const weeklyData = [];
    for (let i = 0; i < days.length; i++) {
      const timerEntriesByDay = timerEntriesSorted.filter((timerEntry) => {
        let day = new Date(timerEntry.date).getDay() - 1;

        day = mod(day, days.length);
        return day === i;
      });

      weeklyData.push(timerEntriesByDay);
    }

    return weeklyData;
  }

  // Returns number of hours tracked for given date
  getDailyData(timerEntries, date = new Date()) {
    if (!timerEntries) return [];

    return timerEntries.filter((timerEntry) => {
      return timerEntry.date === date.toDateString();
    });
  }

  // Returns number of hours tracked for each month in a given year.
  getYearlyData(timerEntries, year = new Date().toFullYear()) {
    if (!timerEntries) return [];

    const filteredTimerEntries = timerEntries.filter((timerEntry) => {
      return new Date(timerEntry.date).getFullYear() === year;
    });

    const sortedTimerEntries = filteredTimerEntries.sort(
      (a, b) => new Date(a.date).getMonth() - new Date(b.date).getMonth()
    );

    const yearlyData = [];
    for (let i = 0; i < months.length; i++) {
      const filteredByMonth = sortedTimerEntries.filter((timerEntry) => {
        return new Date(timerEntry.date).getMonth() === i;
      });

      yearlyData.push(filteredByMonth);
    }

    return yearlyData;
  }

  render() {
    const timerEntryData = this.getTimerEntryData();

    const dailyData = this.getDailyData(timerEntryData, this.state.date);
    const dailyTasks = dailyData.map((timerEntry) => timerEntry.task);
    const dailyDurations = dailyData.map((timerEntry) => timerEntry.duration);
    const totalDailyDuration = Time.addTime(...dailyDurations);
    const dailyHours = dailyDurations.map((dailyDuration) =>
      dailyDuration.toHours()
    );

    const [unproductive, productive] = groupTimerEntriesBy(timerEntryData, [
      "isProductive",
    ]);

    const productiveData = this.getWeeklyData(productive, ...this.state.week);
    const productiveDurations = productiveData.map((timerEntriesByDay) => {
      const durations = timerEntriesByDay.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const productiveHours = productiveDurations.map((weeklyDuration) =>
      weeklyDuration.toHours()
    );

    const unproductiveData = this.getWeeklyData(
      unproductive,
      ...this.state.week
    );
    const unproductiveDurations = unproductiveData.map((timerEntriesByDay) => {
      const durations = timerEntriesByDay.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const unproductiveHours = unproductiveDurations.map((weeklyDuration) =>
      weeklyDuration.toHours()
    );

    const totalWeeklyDuration = Time.addTime(
      ...productiveDurations,
      ...unproductiveDurations
    );

    const yearlyData = this.getYearlyData(timerEntryData, this.state.year);
    const yearlyDurations = yearlyData.map((timerEntriesByMonth) => {
      const durations = timerEntriesByMonth.map(
        (timerEntry) => timerEntry.duration
      );

      return Time.addTime(...durations);
    });
    const totalYearlyDuration = Time.addTime(...yearlyDurations);
    const yearlyHours = yearlyDurations.map((yearlyDuration) =>
      yearlyDuration.toHours()
    );

    return (
      <div className="w-4/5 min-h-screen flex flex-wrap ml-auto p-8 text-gray-600">
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex self-start border border-gray-300 rounded-full">
              <button name="minus" onClick={this.weekChangeHandler}>
                <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
              </button>
              <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300">
                <i className="fa fa-calendar" />
                {this.getWeeklyTitle(...this.state.week)}
              </span>
              <button name="plus" onClick={this.weekChangeHandler}>
                <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
              </button>
            </div>
            <span className="flex items-baseline gap-1">
              Clocked Hours -
              <strong className="font-bold text-lg">
                {totalWeeklyDuration.toTimeString()}
              </strong>
            </span>
          </div>

          <div className="w-full h-[50vh] p-2 border-b border-gray-300">
            <Bar
              data={{
                labels: days,
                datasets: [
                  {
                    label: "Productive Hours",
                    data: productiveHours,
                    backgroundColor: "lightgreen",
                    borderColor: "lightgreen",
                  },
                  {
                    label: "Unproductive Hours",
                    data: unproductiveHours,
                    backgroundColor: "salmon",
                    borderColor: "salmon",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-center gap-4 p-4 border-r border-gray-300">
          <div className="inline-flex border border-gray-300 rounded-full">
            <button name="minus" onClick={this.dateChangeHandler}>
              <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
            </button>
            <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300">
              <i className="fa fa-calendar" />
              {this.getDailyTitle(this.state.date)}
            </span>
            <button name="plus" onClick={this.dateChangeHandler}>
              <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
            </button>
          </div>

          <Doughnut
            data={{
              labels: dailyTasks,
              datasets: [
                {
                  label: "Daily Task Distribution",
                  data: dailyHours,
                  backgroundColor: colors,
                  borderColor: colors,
                },
              ],
            }}
          />

          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalDailyDuration.toTimeString()}
            </strong>
          </span>
        </div>

        <div className="w-2/3 flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <div className="inline-flex self-end border border-gray-300 rounded-full">
              <button name="minus" onClick={this.yearChangeHandler}>
                <i className="fa fa-arrow-left px-4 py-2  text-gray-600" />
              </button>
              <span className="flex items-center gap-2 px-4 py-2 border-x border-gray-300">
                <i className="fa fa-calendar" />
                {this.getYearlyTitle(this.state.year)}
              </span>
              <button name="plus" onClick={this.yearChangeHandler}>
                <i className="fa fa-arrow-right px-4 py-2 text-gray-600" />
              </button>
            </div>

            <span className="flex items-baseline gap-1">
              Clocked Hours -
              <strong className="font-bold text-lg">
                {totalYearlyDuration.toTimeString()}
              </strong>
            </span>
          </div>

          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: "Hours Tracked",
                  data: yearlyHours,
                  backgroundColor: "skyblue",
                  borderColor: "skyblue",
                },
              ],
            }}
          />
        </div>
      </div>
    );
  }
}

export default Reports;

import React from "react";

import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import Time from "../classes/Time";
import { groupTimerEntriesBy } from "../helpers/groupTimerEntriesBy";
import { parseTimerEntriesJSON } from "../helpers/parseTimerEntriesJSON";
import { getDaysPassed } from "../helpers/getDaysPassed";
import { colors } from "../helpers/colors";
import {
  HOURS_IN_DAY,
  MILISECONDS_IN_SECOND,
  MINUTES_IN_HOUR,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "../constants/timeHelper";

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
    const week = this.getWeekByDate(today);
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

  getWeekByDate(date) {
    const weekStart = this.getPrevDate(date, date.getDay() - 1);
    const weekEnd = this.getNextDate(weekStart, 6);

    return [weekStart, weekEnd];
  }

  getDayMiliseconds() {
    return (
      HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILISECONDS_IN_SECOND
    );
  }

  getDailyTitle(date) {
    const presentDate = new Date();
    const yesterdayDate = this.getPrevDate(presentDate);

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
    const lastWeekDate = this.getPrevDate(
      presentDate,
      presentDate.getDay() + 1
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

  getNextDate(date, days = 1) {
    return new Date(date.getTime() + days * this.getDayMiliseconds());
  }

  getPrevDate(date, days = 1) {
    return new Date(date.getTime() - days * this.getDayMiliseconds());
  }

  dateChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      date:
        btn.name === "plus"
          ? this.getNextDate(this.state.date)
          : this.getPrevDate(this.state.date),
    });
  }

  weekChangeHandler(e) {
    const btn = e.target.closest("button");

    this.setState({
      week:
        btn.name === "plus"
          ? [
              this.getNextDate(this.state.week[0], 7),
              this.getNextDate(this.state.week[1], 7),
            ]
          : [
              this.getPrevDate(this.state.week[0], 7),
              this.getPrevDate(this.state.week[1], 7),
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
  getWeeklyData(
    timerEntries,
    weekStart = this.getPrevDate(new Date(), 6),
    weekEnd = new Date()
  ) {
    if (!timerEntries) return [];

    const timerEntriesFiltered = timerEntries.filter((timerEntry) => {
      const ms = new Date(timerEntry.date);
      return ms > weekStart.getTime() && ms < weekEnd.getTime();
    });

    const timerEntriesSorted = timerEntriesFiltered.sort((a, b) => {
      return getDaysPassed(b.date) - getDaysPassed(a.date);
    });

    const durations = [];
    for (let i = 0; i < days.length; i++) {
      const timerEntriesByDay = timerEntriesSorted.filter((timerEntry) => {
        let day = new Date(timerEntry.date).getDay() - 1;

        if (day < 0) {
          day = (day % days.length) + days.length;
        } else {
          day = day % days.length;
        }

        return day === i;
      });

      const durationsByDay = timerEntriesByDay.map(
        (timerEntry) => timerEntry.duration
      );

      durations.push(Time.addTime(...durationsByDay).toHours());
    }

    return durations;
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

    const durations = [];
    for (let i = 0; i < months.length; i++) {
      const filteredByMonth = sortedTimerEntries.filter((timerEntry) => {
        return new Date(timerEntry.date).getMonth() === i;
      });

      const durationsByMonth = filteredByMonth.map(
        (timerEntry) => timerEntry.duration
      );

      durations.push(Time.addTime(...durationsByMonth).toHours());
    }

    return durations;
  }

  render() {
    const timerEntryData = this.getTimerEntryData();

    const dailyData = this.getDailyData(timerEntryData, this.state.date);
    const dailyTasks = dailyData.map((timerEntry) => timerEntry.task);
    const dailyDurations = dailyData.map((timerEntry) => timerEntry.duration);
    const dailyHours = dailyDurations.map((dailyDuration) =>
      dailyDuration.toHours()
    );
    const totalDailyHours = Time.addTime(...dailyDurations);

    const weeklyData = this.getWeeklyData(timerEntryData, ...this.state.week);
    const yearlyData = this.getYearlyData(timerEntryData, this.state.year);

    return (
      <div className="w-4/5 min-h-screen flex flex-wrap ml-auto p-8 text-gray-600">
        <div className="w-full flex flex-col gap-4">
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
          <div className="w-full h-[50vh] p-2 border-b border-gray-300">
            <Bar
              data={{
                labels: days,
                datasets: [
                  {
                    label: "Hours Tracked",
                    data: weeklyData,
                    backgroundColor: "lightgreen",
                    borderColor: "lightgreen",
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="w-2/3 flex flex-col gap-4 p-4">
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

          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: "Hours Tracked",
                  data: yearlyData,
                  backgroundColor: "skyblue",
                  borderColor: "skyblue",
                },
              ],
            }}
          />
        </div>

        <div className="w-1/3 flex flex-col items-center gap-4 p-4 border-l border-gray-300">
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
              {totalDailyHours.toTimeString()}
            </strong>
          </span>
        </div>
      </div>
    );
  }
}

export default Reports;

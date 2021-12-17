import React from "react";

import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { Line, Bar, Doughnut } from "react-chartjs-2";

import Time from "../classes/Time";
import { groupTimerEntriesBy } from "../helpers/groupTimerEntriesBy";
import { parseTimerEntriesJSON } from "../helpers/parseTimerEntriesJSON";
import { getDaysPassed } from "../helpers/getDaysPassed";
import { colors } from "../helpers/colors";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

class Reports extends React.Component {
  getTimerEntryData() {
    const timerEntries = parseTimerEntriesJSON(
      localStorage.getItem("timerEntries")
    );

    return timerEntries.filter((timerEntry) => {
      const daysPassed = getDaysPassed(timerEntry.date);
      return daysPassed < 7 && daysPassed > -1;
    });
  }

  getDaysData(timerEntryData) {
    if (!timerEntryData || timerEntryData.length === 0) return;

    const timerEntriesSorted = timerEntryData.sort((a, b) => {
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

  getTaskData(timerEntryData) {
    const timerEntries = groupTimerEntriesBy(timerEntryData, ["task"]);
    const tasks = timerEntries.map((timerEntry) => {
      return timerEntry[0].task === "" ? "No Title" : timerEntry[0].task;
    });

    const durations = timerEntries.map((timerEntry) => {
      const durations = timerEntry.map((timerEntry) => timerEntry.duration);
      return Time.addTime(...durations).toHours();
    });

    return [tasks, durations];
  }

  render() {
    const timerEntryData = this.getTimerEntryData();

    const [productive, unproductive] = groupTimerEntriesBy(timerEntryData, [
      "isProductive",
    ]);

    const productiveDurations = this.getDaysData(productive);
    const unproductiveDurations = this.getDaysData(unproductive);

    const [tasks, taskDurations] = this.getTaskData(timerEntryData);

    const durations = timerEntryData.map((timerEntry) => timerEntry.duration);
    const totalHours = Time.addTime(...durations);

    return (
      <div className="w-4/5 flex flex-col ml-auto py-2 text-gray-600">
        <div className="w-full h-[50vh] p-2 border-b border-gray-300">
          <Bar
            data={{
              labels: days,
              datasets: [
                {
                  label: "Productive Hours",
                  data: productiveDurations,
                  backgroundColor: "lightgreen",
                  borderColor: "lightgreen",
                },
                {
                  label: "Unproductive Hours",
                  data: unproductiveDurations,
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

        <div className="w-1/3 flex flex-col items-center gap-2 p-2 ml-auto border-l border-gray-300">
          <span className="flex items-baseline gap-1">
            Clocked Hours -
            <strong className="font-bold text-lg">
              {totalHours.toTimeString()}
            </strong>
          </span>
          <Doughnut
            data={{
              labels: tasks,
              datasets: [
                {
                  label: "Task Distribution",
                  data: taskDurations,
                  backgroundColor: colors,
                  borderColor: colors,
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

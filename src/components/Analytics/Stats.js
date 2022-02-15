import React from "react";
import { Duration, DateTime } from "luxon";

class Stats extends React.Component {
  getAverageTrackedHours(timerEntries, totalTrackedHours) {
    if (!timerEntries.length) return Duration.fromMillis(0);
    const earliestTimerEntry = timerEntries
      .slice()
      .sort((a, b) => a.date.toMillis() - b.date.toMillis())[0];

    const dayDifference = Math.round(
      DateTime.now().diff(earliestTimerEntry.date).as("days")
    );

    const averageTrackedHours = Duration.fromMillis(
      totalTrackedHours.toMillis() / dayDifference
    );

    return averageTrackedHours;
  }

  getAverageTasksDone(todos, totalTasksDone) {
    if (!todos.length) return 0;
    const earliestTodo = todos
      .slice()
      .sort((a, b) => a.date.toMillis() - b.date.toMillis())[0];

    const dayDifference = Math.round(
      DateTime.now().diff(earliestTodo.date).as("days")
    );

    const averageTasksDone = Math.round(totalTasksDone / dayDifference);

    return averageTasksDone;
  }

  getAverageRevenueEarned(timerEntries, totalRevenueEarned) {
    if (!timerEntries.length) return 0;
    const earliestTimerEntry = timerEntries
      .slice()
      .sort((a, b) => a.date.toMillis() - b.date.toMillis())[0];

    const dayDifference = Math.round(
      DateTime.now().diff(earliestTimerEntry.date).as("days")
    );

    const averageRevenueEarned = totalRevenueEarned / dayDifference;

    return averageRevenueEarned;
  }

  getCurrentStreak(timerEntries, todos) {
    if (!timerEntries.length && !todos.length) return 0;

    const today = DateTime.now();

    const timerEntriesToday = timerEntries?.filter(
      (timerEntry) => timerEntry.date.toISODate() === today.toISODate()
    );

    const todosToday = todos?.filter(
      (todo) => todo.doneTime?.toISODate() === today.toISODate()
    );

    if (timerEntriesToday.length === 0 && todosToday.length === 0) return 0;

    let prevDate = today.minus({ day: 1 });

    let previousTimerEntries = timerEntriesToday;
    let previousTodos = todosToday;

    let currentStreak = 0;
    while (previousTimerEntries.length > 0 || previousTodos.length > 0) {
      currentStreak++;

      previousTimerEntries = timerEntries?.filter(
        (timerEntry) => timerEntry.date.toISODate() === prevDate.toISODate()
      );

      previousTodos = todos?.filter(
        (todo) => todo.doneTime?.toISODate() === prevDate.toISODate()
      );

      prevDate = prevDate.minus({ day: 1 });
    }

    return currentStreak;
  }

  getLongestStreak(timerEntries, todos) {
    if (!timerEntries.length && !todos.length) return 0;

    const tommorow = DateTime.now().plus({ day: 1 });

    const timerEntryDates = timerEntries.map((timerEntry) => timerEntry.date);
    const todoDates = todos.map((todo) => todo.doneTime);

    const earliestActivity = DateTime.min(...timerEntryDates, ...todoDates);
    let currentDate = earliestActivity;

    let maxStreak = 0;
    let currentStreak = 0;

    while (currentDate.toISODate() !== tommorow.toISODate()) {
      const filteredTimerEntries = timerEntries?.filter(
        (timerEntry) => timerEntry.date.toISODate() === currentDate.toISODate()
      );

      const filteredTodos = todos?.filter(
        (todo) => todo.doneTime?.toISODate() === currentDate.toISODate()
      );

      if (filteredTimerEntries.length > 0 || filteredTodos.length > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }

      currentDate = currentDate.plus({ day: 1 });
    }

    return maxStreak;
  }

  render() {
    const { timerEntries, todos, tags } = this.props;
    const filteredTodos = todos.filter((todo) => todo.isDone);

    const currentStreak = this.getCurrentStreak(timerEntries, filteredTodos);
    const longestStreak = this.getLongestStreak(timerEntries, filteredTodos);

    const totalTrackedHours = timerEntries.reduce(
      (acc, timerEntry) => acc.plus(timerEntry.duration),
      Duration.fromMillis(0)
    );

    const totalTasksDone = filteredTodos.length;

    const billableTimerEntries = timerEntries.filter(
      (timerEntry) => timerEntry.isBillable
    );

    const totalRevenueEarned = billableTimerEntries.reduce(
      (acc, timerEntry) =>
        acc +
        timerEntry.duration.as("hours") *
          tags.find((x) => x.id === timerEntry.tag)?.billableAmount,
      0
    );

    const averageTrackedHours = this.getAverageTrackedHours(
      timerEntries,
      totalTrackedHours
    );
    const averageRevenueEarned = this.getAverageRevenueEarned(
      billableTimerEntries,
      totalRevenueEarned
    );
    const averageTasksDone = this.getAverageTasksDone(
      filteredTodos,
      totalTasksDone
    );

    return (
      <div className="flex w-full flex-col items-center gap-4 sm:grid sm:grid-cols-2 lg:flex lg:flex-row">
        <div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 p-4 lg:w-1/4">
          <h1 className="text-lg font-light">Current Streak</h1>
          <span className="text-2xl font-black text-blue-500">
            {currentStreak}
          </span>
          <span>
            Longest Streak - <span className="text-lg">{longestStreak}</span>
          </span>
        </div>
        <div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 p-4 lg:w-1/4">
          <h1 className="text-lg font-light">Tracked Hours</h1>
          <span className="text-2xl font-black text-blue-500">
            {totalTrackedHours.toFormat("h'h' mm'm'")}
          </span>
          <span>
            Daily Average -{" "}
            <span className="text-lg">
              {averageTrackedHours.toFormat("h'h' mm'm'")}
            </span>
          </span>
        </div>
        <div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 p-4 lg:w-1/4">
          <h1 className="text-lg font-light">Tasks Done</h1>
          <span className="text-2xl font-black text-blue-500">
            {totalTasksDone}
          </span>
          <span>
            Daily Average - <span className="text-lg">{averageTasksDone}</span>
          </span>
        </div>
        <div className="flex w-full flex-col gap-1 rounded-md border border-gray-300 p-4 lg:w-1/4">
          <h1 className="text-lg font-light">Revenue Earned</h1>
          <span className="text-2xl font-black text-blue-500">
            {totalRevenueEarned.toFixed(1)}$
          </span>
          <span>
            Daily Average -{" "}
            <span className="text-lg">{averageRevenueEarned.toFixed(1)}$</span>
          </span>
        </div>
      </div>
    );
  }
}

export default Stats;

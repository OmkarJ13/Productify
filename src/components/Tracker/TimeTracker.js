import React from "react";

import { parseTimerEntriesJSON } from "../../helpers/parseTimerEntriesJSON";
import { restoreTimerEntry } from "../../helpers/restoreTimerEntry";

import Timer from "../Timer/Timer";
import TimerEntries from "./TimerEntries";

class TimeTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTimer: null,
      timerEntries: [],
    };

    this.handleTimerEntryCreated = this.handleTimerEntryCreated.bind(this);
    this.handleTimerEntryEdited = this.handleTimerEntryEdited.bind(this);
    this.handleTimerEntryDeleted = this.handleTimerEntryDeleted.bind(this);
    this.handleTimerEntryDuplicated =
      this.handleTimerEntryDuplicated.bind(this);
    this.handleTimerEntryContinued = this.handleTimerEntryContinued.bind(this);
  }

  render() {
    return (
      <div className="w-4/5 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <Timer
          currentTimer={this.state.currentTimer}
          onTimerEntryCreated={this.handleTimerEntryCreated}
          onTimerInterrupted={this.handleTimerInterrupted}
        />
        <TimerEntries
          timerEntries={this.state.timerEntries}
          onTimerEntryEdited={this.handleTimerEntryEdited}
          onTimerEntryDeleted={this.handleTimerEntryDeleted}
          onTimerEntryDuplicated={this.handleTimerEntryDuplicated}
          onTimerEntryContinued={this.handleTimerEntryContinued}
        />
      </div>
    );
  }

  componentDidMount() {
    document.title = "Track | Productify";

    if ("timerEntries" in localStorage) {
      const storedTimerEntries = localStorage.getItem("timerEntries");
      const restoredTimerEntries = parseTimerEntriesJSON(storedTimerEntries);

      this.setState({
        timerEntries: restoredTimerEntries,
      });
    }

    if ("currentTimer" in localStorage) {
      const storedTimer = JSON.parse(localStorage.getItem("currentTimer"));
      restoreTimerEntry(storedTimer.timerEntry);

      this.setState({
        currentTimer: storedTimer,
      });
    }
  }

  storeTimerEntries() {
    const { timerEntries } = this.state;
    localStorage.setItem("timerEntries", JSON.stringify(timerEntries));
  }

  deleteCurrentTimer() {
    if (localStorage.getItem("currentTimer")) {
      localStorage.removeItem("currentTimer");
    }
  }

  handleTimerEntryCreated(timerEntry) {
    this.setState(
      (prevState) => {
        const { timerEntries } = prevState;

        return {
          currentTimer: null,
          timerEntries: [timerEntry, ...timerEntries],
        };
      },
      () => {
        this.storeTimerEntries();
        this.deleteCurrentTimer();
      }
    );
  }

  handleTimerEntryEdited(editedTimerEntry) {
    this.setState((prevState) => {
      const { timerEntries } = prevState;

      const editIndex = timerEntries.findIndex(
        (entry) => entry.id === editedTimerEntry.id
      );

      timerEntries[editIndex] = editedTimerEntry;

      return {
        timerEntries: timerEntries,
      };
    }, this.storeTimerEntries);
  }

  handleTimerEntryDeleted(timerEntryId) {
    this.setState((prevState) => {
      const timerEntries = prevState.timerEntries.slice();
      const filteredTimerEntries = timerEntries.filter(
        (timerEntry) => timerEntry.id !== timerEntryId
      );

      return {
        timerEntries: filteredTimerEntries,
      };
    }, this.storeTimerEntries);
  }

  handleTimerEntryDuplicated(duplicatedTimerEntry) {
    this.setState((prevState) => {
      const timerEntries = prevState.timerEntries.slice();

      return {
        timerEntries: [...timerEntries, duplicatedTimerEntry],
      };
    }, this.storeTimerEntries);
  }

  handleTimerEntryContinued(timerData) {
    this.setState({
      currentTimer: timerData,
    });
  }

  handleTimerInterrupted(timerData) {
    localStorage.setItem("currentTimer", JSON.stringify(timerData));
  }
}

export default TimeTracker;

import React from "react";
import "./TimeTracker.css";

import { parseTimerEntriesJSON } from "../../helpers/parseTimerEntriesJSON";

import Timer from "../Timer/Timer";
import TimerEntries from "./TimerEntries";
import { ThemeContext } from "../../contexts/ThemeContext";

class TimeTracker extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      timerEntries: [],
    };

    this.handleTimerEntryCreated = this.handleTimerEntryCreated.bind(this);
    this.handleTimerEntryEdited = this.handleTimerEntryEdited.bind(this);
    this.handleTimerEntryDeleted = this.handleTimerEntryDeleted.bind(this);
    this.handleTimerEntryDuplicated =
      this.handleTimerEntryDuplicated.bind(this);
  }

  handleTimerEntryCreated(timerEntry) {
    this.setState((prevState) => {
      const timerEntries = prevState.timerEntries.slice();

      return {
        timerEntries: [timerEntry, ...timerEntries],
      };
    });
  }

  handleTimerEntryEdited(editedTimerEntry) {
    this.setState((prevState) => {
      const timerEntries = prevState.timerEntries.slice();
      const editIndex = timerEntries.findIndex(
        (entry) => entry.id === editedTimerEntry.id
      );

      timerEntries[editIndex] = editedTimerEntry;

      return {
        timerEntries: timerEntries,
      };
    });
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
    });
  }

  handleTimerEntryDuplicated(duplicatedTimerEntry) {
    this.setState((prevState) => {
      const timerEntries = prevState.timerEntries.slice();

      return {
        timerEntries: [...timerEntries, duplicatedTimerEntry],
      };
    });
  }

  componentDidMount() {
    const storedTimerEntries = parseTimerEntriesJSON(
      localStorage.getItem("timerEntries")
    );

    if (storedTimerEntries) {
      this.setState({
        timerEntries: storedTimerEntries,
      });
    }
  }

  componentDidUpdate() {
    localStorage.setItem(
      "timerEntries",
      JSON.stringify(this.state.timerEntries)
    );
  }

  render() {
    return (
      <div className="TimeTracker flex-column">
        <Timer onTimerEntryCreated={this.handleTimerEntryCreated} />
        <TimerEntries
          timerEntries={this.state.timerEntries}
          onTimerEntryEdited={this.handleTimerEntryEdited}
          onTimerEntryDeleted={this.handleTimerEntryDeleted}
          onTimerEntryDuplicated={this.handleTimerEntryDuplicated}
        />
      </div>
    );
  }
}

export default TimeTracker;

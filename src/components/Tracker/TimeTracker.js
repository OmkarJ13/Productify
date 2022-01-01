import React from "react";

import Timer from "../Timer/Timer";
import TimerEntries from "./TimerEntries";

class TimeTracker extends React.Component {
  render() {
    return (
      <div className="w-4/5 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <Timer />
        <TimerEntries />
      </div>
    );
  }

  componentDidMount() {
    document.title = "Track | Productify";
  }
}

export default TimeTracker;

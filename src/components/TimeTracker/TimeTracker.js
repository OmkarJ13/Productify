import React from "react";

import Timer from "./Timer";
import TimerEntries from "./TimerEntries";

class TimeTracker extends React.Component {
  render() {
    return (
      <div className="ml-auto flex min-h-screen w-[85%] flex-col gap-6 p-6 text-gray-600">
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

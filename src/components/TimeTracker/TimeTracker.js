import React from "react";

import Timer from "./Timer";
import TimerEntries from "./TimerEntries";

class TimeTracker extends React.Component {
  render() {
    return (
      <div className="w-[85%] min-h-screen flex flex-col gap-6 ml-auto p-6 text-gray-600">
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

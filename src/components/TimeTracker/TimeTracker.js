import React from "react";

import Timer from "./Timer";
import TimerEntries from "./TimerEntries";

class TimeTracker extends React.Component {
  render() {
    return (
      <div className="mb-auto flex h-[90%] w-full flex-col gap-4 overflow-y-auto p-6 text-gray-600 xl:mb-0 xl:ml-auto xl:min-h-screen xl:w-[85%] xl:gap-6">
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

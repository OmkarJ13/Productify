import React from "react";

class DailyTimerEntries extends React.Component {
  render() {
    const { date, totalDuration, timerEntries } = this.props;

    return (
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase text-lg">
          <h4>{date.toRelativeCalendar({ unit: "days" })}</h4>
          <h4>{totalDuration.toFormat("hh:mm:ss")}</h4>
        </div>

        <div className="w-full flex flex-col">{timerEntries}</div>
      </div>
    );
  }
}

export default DailyTimerEntries;

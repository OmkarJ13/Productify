import React from "react";

class DailyTimerEntries extends React.Component {
  render() {
    const { heading, subHeading, data } = this.props;

    return (
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white uppercase text-lg">
          <h4>{heading}</h4>
          <h4>{subHeading}</h4>
        </div>

        <div className="w-full flex flex-col">{data}</div>
      </div>
    );
  }
}

export default DailyTimerEntries;

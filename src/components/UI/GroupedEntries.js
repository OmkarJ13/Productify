import React from "react";

class GroupedEntries extends React.Component {
  render() {
    const { heading, subHeading, data } = this.props;

    return (
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between bg-blue-500 px-4 py-2 text-lg uppercase text-white">
          <h4 className="w-3/4 overflow-x-clip text-ellipsis whitespace-nowrap">
            {heading}
          </h4>
          <h4>{subHeading}</h4>
        </div>

        <div className="flex w-full flex-col">{data}</div>
      </div>
    );
  }
}

export default GroupedEntries;

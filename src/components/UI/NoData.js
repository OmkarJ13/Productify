import React from "react";
import NoDataImg from "../../Images/NoData.svg";

class NoData extends React.Component {
  render() {
    const { text } = this.props;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <img src={NoDataImg} className="max-w-[200px]" />
        <span className="text-2xl font-light">{text}</span>
      </div>
    );
  }
}

export default NoData;

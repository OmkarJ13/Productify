import React from "react";
import NoDataImg from "../../Images/NoData.svg";

class NoData extends React.Component {
  render() {
    const { text } = this.props;

    return (
      <div className="flex flex-col gap-4 m-auto">
        <img src={NoDataImg} className="w-[200px]" />
        <span className="text-center text-2xl font-light">{text}</span>
      </div>
    );
  }
}

export default NoData;

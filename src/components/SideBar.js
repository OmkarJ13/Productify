import React from "react";
import "./SideBar.css";

class SideBar extends React.Component {
  render() {
    return (
      <div className="SideBar">
        <h4 className="SideBar__link SideBar__link--active">
          <i className="fa fa-clock-o" />
          Time Tracker
        </h4>
      </div>
    );
  }
}

export default SideBar;

import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

class SideBar extends React.Component {
  render() {
    return (
      <div className="SideBar">
        <h2 className="SideBar__heading">
          <i className="fa fa-hourglass" />
          Productify
        </h2>
        <div className="SideBar__links">
          <NavLink
            to="/track"
            exact
            className={"SideBar__link"}
            activeClassName="SideBar__link--active"
          >
            <i className="fa fa-clock-o" />
            Time Tracker
          </NavLink>
          <NavLink
            to="/reports"
            exact
            className={"SideBar__link"}
            activeClassName="SideBar__link--active"
          >
            <i className="fa fa-bar-chart" />
            Reports
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideBar;

import React from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

class SideBar extends React.Component {
  render() {
    return (
      <div className="SideBar flex-column">
        <h2 className="SideBar__heading flex justify-center">
          <i className="fa fa-hourglass" />
          Productify
        </h2>
        <div className="SideBar__links flex-column">
          <NavLink
            to="/track"
            exact
            className={"SideBar__link flex"}
            activeClassName="SideBar__link--active"
          >
            <i className="fa fa-clock-o" />
            Time Tracker
          </NavLink>
          <NavLink
            to="/reports"
            exact
            className={"SideBar__link flex"}
            activeClassName="SideBar__link--active"
          >
            <i className="fa fa-bar-chart" />
            Reports
          </NavLink>
          <NavLink
            to="/settings"
            exact
            className={"SideBar__link flex"}
            activeClassName="SideBar__link--active"
          >
            <i className="fa fa-cog" />
            Settings
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideBar;

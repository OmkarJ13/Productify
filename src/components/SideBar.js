import React from "react";
import { NavLink } from "react-router-dom";

class SideBar extends React.Component {
  render() {
    return (
      <div className="fixed top-0 left-0 w-1/5 h-screen flex flex-col items-center gap-8 py-8 bg-blue-500 text-white">
        <h2 className="flex items-center gap-4  font-bold text-4xl">
          <i className="fa fa-hourglass" />
          Productify
        </h2>
        <div className="w-full flex flex-col gap-2 items-center pl-4 pr-8">
          <NavLink
            to="/track"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-xl  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <i className="fa fa-clock-o" />
            Time Tracker
          </NavLink>
          <NavLink
            to="/reports"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-xl  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <i className="fa fa-bar-chart" />
            Reports
          </NavLink>
          <NavLink
            to="/settings"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-xl  hover:bg-blue-400"
            activeClassName="bg-blue-400"
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

import React from "react";
import { NavLink } from "react-router-dom";

import { AlarmOn, Analytics, Settings, Timer } from "@mui/icons-material";

class SideBar extends React.Component {
  render() {
    return (
      <div className="fixed top-0 left-0 w-2/12 h-screen flex flex-col items-center gap-8 py-8 bg-gradient-to-br from-blue-500 to-blue-400 text-white">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <AlarmOn fontSize="large" />
          Productify
        </h1>
        <div className="w-full flex flex-col gap-2 items-center">
          <NavLink
            to="/track"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <Timer />
            Time Tracker
          </NavLink>
          <NavLink
            to="/reports"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <Analytics />
            Reports
          </NavLink>
          <NavLink
            to="/settings"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <Settings />
            Settings
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideBar;

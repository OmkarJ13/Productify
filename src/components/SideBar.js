import React from "react";
import { NavLink } from "react-router-dom";

import {
  AccountCircle,
  AlarmOn,
  Analytics,
  LocalOffer,
  Settings,
  StickyNote2,
  Timer,
} from "@mui/icons-material";

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
            to="/todo"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <StickyNote2 />
            Todo
          </NavLink>
          <span className="self-start px-4 mt-4 text-xs font-light uppercase">
            Analyze
          </span>
          <NavLink
            to="/analytics"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <Analytics />
            Analytics
          </NavLink>
          <span className="self-start px-4 mt-4 text-xs font-light uppercase">
            Manage
          </span>
          <NavLink
            to="/tags"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <LocalOffer />
            Tags
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
          <NavLink
            to="/account"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            <AccountCircle />
            Account
          </NavLink>
        </div>
      </div>
    );
  }
}

export default SideBar;

import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";

import {
  AccountCircle,
  AccountCircleOutlined,
  AlarmOn,
  Analytics,
  AnalyticsOutlined,
  LocalOffer,
  LocalOfferOutlined,
  Settings,
  SettingsOutlined,
  StickyNote2,
  StickyNote2Outlined,
  Timer,
  TimerOutlined,
} from "@mui/icons-material";

class SideBar extends React.Component {
  render() {
    const path = this.props.location.pathname;
    return (
      <div className="fixed top-0 left-0 w-[15%] h-screen flex flex-col items-center gap-8 py-8 bg-gradient-to-br from-blue-500 to-blue-400 text-white">
        <h1 className="flex items-center gap-1 text-2xl font-bold">
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
            {path === "/track" ? <Timer /> : <TimerOutlined />}
            Time Tracker
          </NavLink>
          <NavLink
            to="/todo"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/todo" ? <StickyNote2 /> : <StickyNote2Outlined />}
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
            {path === "/analytics" ? <Analytics /> : <AnalyticsOutlined />}
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
            {path === "/tags" ? <LocalOffer /> : <LocalOfferOutlined />}
            Tags
          </NavLink>
          <NavLink
            to="/settings"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/settings" ? <Settings /> : <SettingsOutlined />}
            Settings
          </NavLink>
          <NavLink
            to="/account"
            exact
            className="w-full flex gap-2 items-center px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/account" ? (
              <AccountCircle />
            ) : (
              <AccountCircleOutlined />
            )}
            Account
          </NavLink>
        </div>
      </div>
    );
  }
}

export default withRouter(SideBar);

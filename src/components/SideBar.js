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
  StickyNote2,
  StickyNote2Outlined,
  Timer,
  TimerOutlined,
} from "@mui/icons-material";

class SideBar extends React.Component {
  render() {
    const path = this.props.location.pathname;
    return (
      <div className="fixed top-0 left-0 flex h-screen w-[15%] flex-col items-center gap-8 bg-gradient-to-br from-blue-500 to-blue-400 py-8 text-white">
        <h1 className="flex items-center gap-1 text-2xl font-bold">
          <AlarmOn fontSize="large" />
          Productify
        </h1>
        <div className="flex w-full flex-col items-center gap-2">
          <NavLink
            to="/track"
            exact
            className="flex w-full items-center gap-2 px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/track" ? <Timer /> : <TimerOutlined />}
            Time Tracker
          </NavLink>
          <NavLink
            to="/tasks"
            exact
            className="flex w-full items-center gap-2 px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/tasks" ? <StickyNote2 /> : <StickyNote2Outlined />}
            Tasks
          </NavLink>
          <span className="mt-4 self-start px-4 text-xs font-light uppercase">
            Analyze
          </span>
          <NavLink
            to="/analytics"
            exact
            className="flex w-full items-center gap-2 px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/analytics" ? <Analytics /> : <AnalyticsOutlined />}
            Analytics
          </NavLink>
          <span className="mt-4 self-start px-4 text-xs font-light uppercase">
            Manage
          </span>
          <NavLink
            to="/tags"
            exact
            className="flex w-full items-center gap-2 px-4 py-2 text-lg  hover:bg-blue-400"
            activeClassName="bg-blue-400"
          >
            {path === "/tags" ? <LocalOffer /> : <LocalOfferOutlined />}
            Tags
          </NavLink>
          <NavLink
            to="/account"
            exact
            className="flex w-full items-center gap-2 px-4 py-2 text-lg  hover:bg-blue-400"
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

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
      <div className="fixed bottom-0 left-0 flex h-[10%] w-full bg-blue-500 text-white xl:h-screen xl:w-[15%] xl:flex-col xl:py-8">
        <h1 className="hidden xl:mb-8 xl:flex xl:items-center xl:justify-center xl:gap-1 xl:text-2xl xl:font-black">
          <AlarmOn fontSize="large" />
          Productify
        </h1>
        <NavLink
          to="/track"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 xl:w-full xl:justify-start xl:px-4 xl:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/track" ? <Timer /> : <TimerOutlined />}
          <span className="hidden xl:inline">Time Tracker</span>
        </NavLink>
        <NavLink
          to="/tasks"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 xl:w-full xl:justify-start xl:px-4 xl:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/tasks" ? <StickyNote2 /> : <StickyNote2Outlined />}
          <span className="hidden xl:inline">Tasks</span>
        </NavLink>
        <span className="my-4 hidden self-start px-4 text-xs font-medium uppercase xl:inline">
          <span>Analyze</span>
        </span>
        <NavLink
          to="/analytics"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 xl:w-full xl:justify-start xl:px-4 xl:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/analytics" ? <Analytics /> : <AnalyticsOutlined />}
          <span className="hidden xl:inline">Analytics</span>
        </NavLink>
        <span className="mt-auto hidden self-start px-4 text-xs font-medium uppercase xl:inline">
          <span>Manage</span>
        </span>
        <NavLink
          to="/tags"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 xl:w-full xl:justify-start xl:px-4 xl:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/tags" ? <LocalOffer /> : <LocalOfferOutlined />}
          <span className="hidden xl:inline">Tags</span>
        </NavLink>
        <NavLink
          to="/account"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 xl:w-full xl:justify-start xl:px-4 xl:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/account" ? <AccountCircle /> : <AccountCircleOutlined />}
          <span className="hidden xl:inline">Account</span>
        </NavLink>
      </div>
    );
  }
}

export default withRouter(SideBar);

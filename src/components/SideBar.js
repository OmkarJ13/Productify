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
      <div className="fixed bottom-0 left-0 flex h-[75px] w-full bg-blue-500 text-white lg:h-screen lg:w-[15%] lg:flex-col lg:py-8">
        <h1 className="hidden lg:mb-8 lg:flex lg:items-center lg:justify-center lg:gap-1 lg:text-2xl lg:font-black">
          <AlarmOn fontSize="large" />
          Productify
        </h1>
        <NavLink
          to="/track"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 lg:w-full lg:justify-start lg:px-4 lg:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/track" ? <Timer /> : <TimerOutlined />}
          <span className="hidden lg:inline">Time Tracked</span>
        </NavLink>
        <NavLink
          to="/tasks"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 lg:w-full lg:justify-start lg:px-4 lg:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/tasks" ? <StickyNote2 /> : <StickyNote2Outlined />}
          <span className="hidden lg:inline">Tasks</span>
        </NavLink>
        <span className="my-4 hidden self-start px-4 text-xs font-light uppercase lg:inline">
          <span>Analyze</span>
        </span>
        <NavLink
          to="/analytics"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 lg:w-full lg:justify-start lg:px-4 lg:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/analytics" ? <Analytics /> : <AnalyticsOutlined />}
          <span className="hidden lg:inline">Analytics</span>
        </NavLink>
        <span className="my-4 hidden self-start px-4 text-xs font-light uppercase lg:inline">
          <span>Manage</span>
        </span>
        <NavLink
          to="/tags"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 lg:w-full lg:justify-start lg:px-4 lg:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/tags" ? <LocalOffer /> : <LocalOfferOutlined />}
          <span className="hidden lg:inline">Tags</span>
        </NavLink>
        <NavLink
          to="/account"
          exact
          className="flex w-1/5 items-center justify-center gap-2 text-lg hover:bg-blue-400 lg:w-full lg:justify-start lg:px-4 lg:py-2"
          activeClassName="bg-blue-400"
        >
          {path === "/account" ? <AccountCircle /> : <AccountCircleOutlined />}
          <span className="hidden lg:inline">Account</span>
        </NavLink>
      </div>
    );
  }
}

export default withRouter(SideBar);

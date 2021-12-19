import React from "react";
import { Redirect, Route, Switch } from "react-router";

import SideBar from "./SideBar";
import TimeTracker from "./Tracker/TimeTracker";
import Reports from "./Reports/Reports";
import Settings from "./Settings";

class ProductivityApp extends React.Component {
  render() {
    return (
      <div className="flex font-inter">
        <SideBar />

        <Switch>
          <Route path="/track" exact component={TimeTracker} />
          <Route path="/reports" exact component={Reports} />
          <Route path="/settings" exact component={Settings} />
          <Redirect to="/track" />
        </Switch>
      </div>
    );
  }
}

export default ProductivityApp;

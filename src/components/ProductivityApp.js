import React from "react";
import { Redirect, Route, Switch } from "react-router";
import "./ProductivityApp.css";

import SideBar from "./SideBar";
import TimeTracker from "./Tracker/TimeTracker";
import Reports from "./Reports";
import Settings from "./Settings";

class ProductivityApp extends React.Component {
  render() {
    return (
      <div className="ProductivityApp flex">
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

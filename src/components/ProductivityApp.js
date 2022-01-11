import React from "react";
import { Redirect, Route, Switch } from "react-router";

import SideBar from "./SideBar";
import TimeTracker from "./TimeTracker/TimeTracker";
import Todo from "./Todo";
import Reports from "./Reports/Reports";
import Tags from "./Tags";
import Settings from "./Settings";
import Account from "./Account";

class ProductivityApp extends React.Component {
  render() {
    return (
      <div className="flex font-inter">
        <SideBar />

        <Switch>
          <Route path="/track" exact component={TimeTracker} />
          <Route path="/todo" exact component={Todo} />
          <Route path="/analytics" exact component={Reports} />
          <Route path="/tags" exact component={Tags} />
          <Route path="/account" exact component={Account} />
          <Route path="/settings" exact component={Settings} />
          <Redirect to="/track" />
        </Switch>
      </div>
    );
  }
}

export default ProductivityApp;

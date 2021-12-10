import React from "react";
import { Redirect, Route, Switch } from "react-router";
import "./ProductivityApp.css";

import SideBar from "./SideBar";
import TimeTracker from "./TimeTracker";
import Reports from "./Reports";

class ProductivityApp extends React.Component {
  render() {
    return (
      <div className="ProductivityApp">
        <SideBar />

        <Switch>
          <Route path="/track" exact component={TimeTracker} />
          <Route path="/reports" exact component={Reports} />
          <Redirect to="/track" />
        </Switch>
      </div>
    );
  }
}

export default ProductivityApp;

import React from "react";
import { Redirect, Route, Switch } from "react-router";
import "./ProductivityApp.css";

import SideBar from "./SideBar";
import TimeTracker from "./Tracker/TimeTracker";
import Reports from "./Reports";
import Settings from "./Settings";

import { ThemeContext } from "../contexts/ThemeContext";

class ProductivityApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
      changeTheme: this.changeTheme.bind(this),
    };
  }

  changeTheme() {
    this.setState({
      theme: this.state.theme === "light" ? "dark" : "light",
    });
  }

  render() {
    const themeClass = this.state.theme === "dark" ? "Productivity-dark" : "";

    return (
      <ThemeContext.Provider value={this.state}>
        <div className={`ProductivityApp flex ${themeClass}`}>
          <SideBar />

          <Switch>
            <Route path="/track" exact component={TimeTracker} />
            <Route path="/reports" exact component={Reports} />
            <Route path="/settings" exact component={Settings} />
            <Redirect to="/track" />
          </Switch>
        </div>
      </ThemeContext.Provider>
    );
  }
}

export default ProductivityApp;

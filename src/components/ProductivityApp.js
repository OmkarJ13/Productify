import React from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from "react-router";

import SideBar from "./SideBar";
import TimeTracker from "./TimeTracker/TimeTracker";
import Analytics from "./Analytics/Analytics";
import Tags from "./Tags/Tags";
import Account from "./Account/Account";
import TaskTracker from "./Todo/TaskTracker";
import Welcome from "./Welcome/Welcome";

class ProductivityApp extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.user || this.props.user) {
      // if currently someone is logged in and this user is different than the one logged in before, redirect to to main content
      if (
        this.props.user !== null &&
        prevProps.user?.uid !== this.props.user?.uid
      )
        // redirect to productify
        this.props.history.push("/track");
    }
  }

  render() {
    return (
      <div className="flex h-[100vh] text-sm sm:text-base">
        {this.props.location.pathname !== "/welcome" && <SideBar />}

        <Switch>
          <Route path="/track" exact component={TimeTracker} />
          <Route path="/tasks" exact component={TaskTracker} />
          <Route path="/analytics" exact component={Analytics} />
          <Route path="/tags" exact component={Tags} />
          <Route path="/account" exact component={Account} />
          <Route path="/welcome" exact component={Welcome} />

          <Redirect to="/welcome" />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default withRouter(connect(mapStateToProps)(ProductivityApp));

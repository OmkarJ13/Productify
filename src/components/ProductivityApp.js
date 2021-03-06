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
import { toast } from "react-toastify";

// Configure toast to mount without specifying ToastContains each time
toast.configure({
  position: "bottom-right",
  autoClose: 3000,
  toastClassName:
    "bg-white text-gray-600 font-inter rounded-none border shadow-md border-gray-200",
  hideProgressBar: true,
  draggablePercent: 60,
});

class ProductivityApp extends React.Component {
  componentDidUpdate(prevProps) {
    this.verifyUser();

    // If the currently logged in user is different from last time, redirect to main content
    if (prevProps.user?.uid !== this.props.user?.uid && this.props.user) {
      this.props.history.replace("/track");
    }
  }

  // Prevents the user from manully entering routes while logged out
  verifyUser() {
    if (
      (this.props.user === null) &
      (this.props.location.pathname !== "/welcome")
    ) {
      this.props.history.replace("/welcome");
    }
  }

  componentDidMount() {
    this.verifyUser();
  }

  render() {
    return (
      <div className="flex h-[100vh]">
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

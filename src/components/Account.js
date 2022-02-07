import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { signOut } from "firebase/auth";

import { auth } from "../firebase.config";

class Account extends React.Component {
  componentDidMount() {
    document.title = "Account | Productify";
  }

  render() {
    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        <h2>Account</h2>
        {this.props.user?.email}
        <button
          className="w-fit px-4 py-2 rounded-md bg-red-500 text-white"
          onClick={async () => {
            await signOut(auth);
            this.props.history.push("/welcome");
          }}
        >
          Log Out
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default withRouter(connect(mapStateToProps)(Account));

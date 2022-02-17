import { Forward, Person } from "@mui/icons-material";
import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

import { auth } from "../../firebase.config";
import { firebaseErrors } from "../../helpers/firebaseErrors";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: "",
    };

    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  handleEmailChanged(e) {
    this.setState({
      email: e.target.value,
      errorMessage: "",
    });
  }

  async resetPassword() {
    try {
      await sendPasswordResetEmail(auth, this.state.email);
      toast(() => {
        return (
          <div className="flex items-center gap-4">
            <Forward /> Check your email!
          </div>
        );
      });
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  render() {
    const { email, errorMessage } = this.state;

    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          toastClassName={
            "bg-white text-gray-600 font-inter rounded-none border shadow-md border-gray-200"
          }
          hideProgressBar={true}
        />
        <div className="flex flex-col items-center gap-4">
          <h1 className="mb-4 text-2xl font-bold uppercase">Reset Password</h1>

          <div className="flex w-[300px] items-center gap-2 border border-gray-300 p-2">
            <input
              type="text"
              name="email"
              className="flex-grow outline-none"
              placeholder="Enter email"
              value={email}
              onChange={this.handleEmailChanged}
            />
            <Person fontSize="small" />
          </div>
          <span className="w-[300px] text-sm text-red-500">{errorMessage}</span>

          <button
            className="w-[300px] rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
            onClick={this.resetPassword}
            disabled={email === ""}
          >
            Reset Password
          </button>

          <div className="text-sm">
            Got password?{" "}
            <button onClick={this.props.onSignInClicked}>Sign In.</button>
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;

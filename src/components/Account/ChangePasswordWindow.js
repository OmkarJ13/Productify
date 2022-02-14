import { updatePassword } from "firebase/auth";
import React from "react";
import { connect } from "react-redux";

import { firebaseErrors } from "../../helpers/firebaseErrors";
import ModalWindow from "../UI/ModalWindow";
import ReauthenticateWindow from "./ReauthenticateWindow";

class ChangePasswordWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      errorMessage: "",
      userAuthenticated: false,
    };

    this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
    this.handleUserPasswordChanged = this.handleUserPasswordChanged.bind(this);
    this.handleUserAuthenticated = this.handleUserAuthenticated.bind(this);
  }

  handlePasswordChanged(e) {
    this.setState({
      password: e.target.value,
      errorMessage: "",
    });
  }

  handleUserAuthenticated() {
    this.setState({
      userAuthenticated: true,
    });
  }

  async handleUserPasswordChanged() {
    try {
      const { password } = this.state;
      const { user } = this.props;

      await updatePassword(user, password);

      this.props.onClose();
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  resetState() {
    this.setState({
      password: "",
      errorMessage: "",
      userAuthenticated: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.resetState();
    }
  }

  render() {
    const { password, errorMessage, userAuthenticated } = this.state;

    return (
      <>
        <ReauthenticateWindow
          open={this.props.open && !userAuthenticated}
          onClose={this.props.onClose}
          onUserAuthenticated={this.handleUserAuthenticated}
        />

        <ModalWindow open={userAuthenticated} onClose={this.props.onClose}>
          <div className="flex w-[25vw] flex-col gap-4">
            <h2 className="flex gap-2 border-b border-gray-300 text-2xl font-bold uppercase text-blue-500">
              Change Password
            </h2>
            <div className="flex flex-col gap-2">
              <label>Enter New Password</label>
              <input
                type="password"
                className="rounded-md border border-gray-300 p-2 focus:outline-none"
                value={password}
                onChange={this.handlePasswordChanged}
              />
              {errorMessage !== "" && (
                <span className="text-sm text-red-500">{errorMessage}</span>
              )}
            </div>
            <button
              className="self-end rounded-md bg-blue-500 px-4 py-2 text-white"
              onClick={this.handleUserPasswordChanged}
            >
              Save
            </button>
          </div>
        </ModalWindow>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps)(ChangePasswordWindow);

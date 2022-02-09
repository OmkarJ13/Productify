import {
  EmailAuthCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import React from "react";
import { connect } from "react-redux";

import { firebaseErrors } from "../../helpers/firebaseErrors";
import ModalWindow from "../UI/ModalWindow";

class ReauthenticateWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      errorMessage: "",
    };

    this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
    this.handleUserAuthentication = this.handleUserAuthentication.bind(this);
  }

  handlePasswordChanged(e) {
    this.setState({
      password: e.target.value,
      errorMessage: "",
    });
  }

  async handleUserAuthentication() {
    try {
      const { password } = this.state;
      const { user } = this.props;

      const userCredential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, userCredential);

      this.props.onUserAuthenticated();
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
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.resetState();
    }
  }

  render() {
    const { password, errorMessage } = this.state;

    return (
      <ModalWindow open={this.props.open} onClose={this.props.onClose}>
        <div className="w-[25vw] flex flex-col gap-4">
          <h2 className="flex gap-2 text-blue-500 text-2xl font-bold uppercase border-b border-gray-300">
            Reauthenticate
          </h2>
          <div className="flex flex-col gap-2">
            <label>Re-Enter Password</label>
            <input
              type="password"
              className="focus:outline-none p-2 border border-gray-300 rounded-md"
              value={password}
              name="password"
              onChange={this.handlePasswordChanged}
            />
            {errorMessage !== "" && (
              <span className="text-sm text-red-500">{errorMessage}</span>
            )}
          </div>
          <button
            className="self-end px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={this.handleUserAuthentication}
          >
            Authenticate
          </button>
        </div>
      </ModalWindow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

export default connect(mapStateToProps)(ReauthenticateWindow);

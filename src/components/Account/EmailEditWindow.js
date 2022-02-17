import { updateEmail } from "firebase/auth";
import React from "react";
import { connect } from "react-redux";

import { firebaseErrors } from "../../helpers/firebaseErrors";
import ModalWindow from "../UI/ModalWindow";
import ReauthenticateWindow from "./ReauthenticateWindow";

class EmailEditWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: "",
      userAuthenticated: false,
    };

    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.handleUserEmailChanged = this.handleUserEmailChanged.bind(this);
    this.handleUserAuthenticated = this.handleUserAuthenticated.bind(this);
  }

  handleEmailChanged(e) {
    this.setState({
      email: e.target.value,
      errorMessage: "",
    });
  }

  async handleUserEmailChanged() {
    try {
      const { email } = this.state;
      const { user } = this.props;

      await updateEmail(user, email);

      this.props.onUserEmailChanged(email);
      this.props.onClose();
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  handleUserAuthenticated() {
    this.setState({
      userAuthenticated: true,
    });
  }

  resetState() {
    this.setState({
      email: "",
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
    const { email, errorMessage, userAuthenticated } = this.state;

    return (
      <>
        <ReauthenticateWindow
          open={this.props.open && !userAuthenticated}
          onClose={this.props.onClose}
          onUserAuthenticated={this.handleUserAuthenticated}
        />
        <ModalWindow open={userAuthenticated} onClose={this.props.onClose}>
          <div className="flex w-[280px] flex-col gap-4">
            <h2 className="flex gap-2 border-b border-gray-300 text-2xl font-semibold uppercase text-blue-500">
              Change Email
            </h2>
            <div className="flex flex-col gap-2">
              <label>Enter New Email</label>
              <input
                type="text"
                className="border border-gray-300 p-2 focus:outline-none"
                value={email}
                onChange={this.handleEmailChanged}
              />
              {errorMessage !== "" && (
                <span className="text-sm text-red-500">{errorMessage}</span>
              )}
            </div>
            <button
              className="self-end bg-blue-500 px-4 py-2 text-white"
              onClick={this.handleUserEmailChanged}
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

export default connect(mapStateToProps)(EmailEditWindow);

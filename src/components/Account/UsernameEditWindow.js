import { updateProfile } from "firebase/auth";
import React from "react";
import { connect } from "react-redux";

import { firebaseErrors } from "../../helpers/firebaseErrors";
import ModalWindow from "../UI/ModalWindow";

class UsernameEditWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      errorMessage: "",
    };

    this.handleUsernameChanged = this.handleUsernameChanged.bind(this);
    this.handleUsernameSave = this.handleUsernameSave.bind(this);
  }

  handleUsernameChanged(e) {
    this.setState({
      username: e.target.value,
      errorMessage: "",
    });
  }

  async handleUsernameSave() {
    try {
      const { username } = this.state;
      const { user } = this.props;

      if (username.length > 20) {
        this.setState({
          errorMessage: "Username length should be less than 20 characters.",
        });

        return;
      }

      await updateProfile(user, { displayName: username });

      this.props.onUsernameChanged(username);
      this.props.onClose();
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  resetState() {
    this.setState({
      username: "",
      errorMessage: "",
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.resetState();
    }
  }

  render() {
    const { username, errorMessage } = this.state;

    return (
      <ModalWindow open={this.props.open} onClose={this.props.onClose}>
        <div className="flex w-[25vw] flex-col gap-4">
          <h2 className="flex gap-2 border-b border-gray-300 text-2xl font-bold uppercase text-blue-500">
            Change Username
          </h2>
          <div className="flex flex-col gap-2">
            <label>Enter New Username</label>
            <input
              type="text"
              className="rounded-md border border-gray-300 p-2 focus:outline-none"
              value={username}
              onChange={this.handleUsernameChanged}
            />
            {errorMessage !== "" && (
              <span className="text-sm text-red-500">{errorMessage}</span>
            )}
          </div>

          <button
            className="self-end rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={this.handleUsernameSave}
          >
            Save
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

export default connect(mapStateToProps)(UsernameEditWindow);

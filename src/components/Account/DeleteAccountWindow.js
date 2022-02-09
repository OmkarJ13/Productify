import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { connect } from "react-redux";
import { db } from "../../firebase.config";
import { firebaseErrors } from "../../helpers/firebaseErrors";
import ModalWindow from "../UI/ModalWindow";
import ReauthenticateWindow from "./ReauthenticateWindow";

class DeleteAccountWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAuthenticated: false,
    };

    this.handleUserAuthenticated = this.handleUserAuthenticated.bind(this);
    this.handleAccountDelete = this.handleAccountDelete.bind(this);
  }

  handleUserAuthenticated() {
    this.setState({
      userAuthenticated: true,
    });
  }

  async handleAccountDelete() {
    try {
      const { user } = this.props;

      const userDocRef = doc(db, "users", user.uid);

      await deleteDoc(userDocRef);
      await deleteUser(user);

      this.props.onUserDeleted();
      this.props.onClose();
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  resetState() {
    this.setState({
      userAuthenticated: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.resetState();
    }
  }

  render() {
    const { userAuthenticated } = this.state;

    return (
      <>
        <ReauthenticateWindow
          open={this.props.open && !userAuthenticated}
          onClose={this.props.onClose}
          onUserAuthenticated={this.handleUserAuthenticated}
        />

        <ModalWindow open={userAuthenticated} onClose={this.props.onClose}>
          <div className="w-[25vw] flex flex-col gap-4">
            <h2 className="flex gap-2 text-blue-500 text-2xl font-bold uppercase border-b border-gray-300">
              Delete Account
            </h2>
            <h3>
              Are you sure? Deleting account will permanently delete all of your
              data, this action is not reversible
            </h3>
            <button
              className="self-end bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={this.handleAccountDelete}
            >
              Delete
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

export default connect(mapStateToProps)(DeleteAccountWindow);

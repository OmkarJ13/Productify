import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { signOut, updateProfile } from "firebase/auth";
import { ImagePicker } from "react-file-picker";
import { Edit, FileUpload, Logout } from "@mui/icons-material";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { auth, storage } from "../../firebase.config";
import WindowHandler from "../UI/WindowHandler";
import EmailEditWindow from "./EmailEditWindow";
import UsernameEditWindow from "./UsernameEditWindow";
import ChangePasswordWindow from "./ChangePasswordWindow";
import DeleteAccountWindow from "./DeleteAccountWindow";

import DefaultProfile from "../../Images/DefaultProfile.png";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.user?.displayName ?? "",
      email: this.props.user?.email ?? "",

      errorMessage: "",
    };

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleUsernameChanged = this.handleUsernameChanged.bind(this);
    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.handlePhotoURLChanged = this.handlePhotoURLChanged.bind(this);
  }

  componentDidMount() {
    document.title = "Account | Productify";
  }

  handleUsernameChanged(username) {
    this.setState({
      username,
    });
  }

  handleEmailChanged(email) {
    this.setState({
      email,
    });
  }

  async handlePhotoURLChanged(base64) {
    const { user } = this.props;

    const userProfileRef = ref(storage, `users/${user.uid}/profileImage/`);
    await uploadString(userProfileRef, base64, "data_url");

    const photoURL = await getDownloadURL(userProfileRef);
    await updateProfile(user, { photoURL });

    this.setState({
      errorMessage: "",
    });
  }

  async handleSignOut() {
    await signOut(auth);
    this.props.history.replace("/welcome");
  }

  render() {
    const { username, email } = this.state;

    return (
      <div className="mb-auto flex h-[90%] w-full flex-col gap-4 overflow-y-auto p-6 text-gray-600 xl:mb-0 xl:ml-auto xl:min-h-screen xl:w-[85%] xl:gap-6">
        <div className="flex w-full flex-col items-center gap-4 border border-gray-200 p-4 shadow-md sm:flex-row sm:justify-between">
          <h1 className="text-2xl font-bold uppercase">Account</h1>
          <button
            className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white"
            onClick={this.handleSignOut}
          >
            <Logout />
            Log Out
          </button>
        </div>

        {this.state.errorMessage !== "" && (
          <span className="mx-auto mb-4 text-red-500">
            {this.state.errorMessage}
          </span>
        )}

        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
          <ImagePicker
            extensions={["jpg", "jpeg", "png"]}
            dims={{
              minWidth: 100,
              maxWidth: 500,
              minHeight: 100,
              maxHeight: 500,
            }}
            onChange={this.handlePhotoURLChanged}
            onError={(errorMessage) => this.setState({ errorMessage })}
          >
            <div className="group relative">
              <button className="absolute top-1/2 left-1/2 h-full w-full translate-x-[-50%] translate-y-[-50%] rounded-[50%] bg-black bg-opacity-20 text-6xl text-white opacity-0 transition-opacity group-hover:opacity-100">
                <FileUpload fontSize="inherit" />
              </button>

              <img
                src={
                  this.props.user
                    ? this.props.user.photoURL ?? DefaultProfile
                    : DefaultProfile
                }
                className="h-[200px] w-[200px] rounded-[50%] border border-gray-300 object-cover"
              />
            </div>
          </ImagePicker>

          <div className="flex w-full flex-col gap-4 sm:w-fit">
            <div className="flex w-full flex-col gap-2 sm:w-fit">
              <label>Username</label>
              <div className="flex">
                <span className="w-full overflow-x-hidden text-ellipsis rounded-l-md border-y border-l border-gray-300 px-4 py-2 sm:w-[250px]">
                  {username}
                </span>
                <WindowHandler
                  className="rounded-r-md bg-blue-500 p-2 text-white"
                  renderWindow={(otherProps) => {
                    return (
                      <UsernameEditWindow
                        onUsernameChanged={this.handleUsernameChanged}
                        {...otherProps}
                      />
                    );
                  }}
                >
                  <Edit />
                </WindowHandler>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-fit">
              <label>Your Email</label>
              <div className="flex">
                <span className="w-full overflow-x-hidden text-ellipsis rounded-l-md border-y border-l border-gray-300 px-4 py-2 sm:w-[250px]">
                  {email}
                </span>
                <WindowHandler
                  className="rounded-r-md bg-blue-500 p-2 text-white"
                  renderWindow={(otherProps) => {
                    return (
                      <EmailEditWindow
                        onUserEmailChanged={this.handleEmailChanged}
                        {...otherProps}
                      />
                    );
                  }}
                >
                  <Edit />
                </WindowHandler>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col border-y border-gray-300">
          <div className="flex flex-col gap-4 border-b border-gray-300 py-2 last-of-type:border-none sm:flex-row sm:justify-between">
            <div className="flex flex-col sm:w-4/5">
              <h1 className="font-semibold">Change Password</h1>
              <h2>Update your old password</h2>
            </div>
            <WindowHandler
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white sm:w-1/5"
              renderWindow={(otherProps) => {
                return <ChangePasswordWindow {...otherProps} />;
              }}
            >
              Change Password
            </WindowHandler>
          </div>
          <div className="flex flex-col gap-4 py-2 last-of-type:border-none sm:flex-row sm:justify-between">
            <div className="flex flex-col sm:w-4/5">
              <h1 className="font-bold">Delete Account</h1>
              <h2>
                Deleting your account will permanently delete all of your data
              </h2>
            </div>
            <WindowHandler
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-white sm:w-1/5"
              renderWindow={(otherProps) => {
                return <DeleteAccountWindow {...otherProps} />;
              }}
            >
              Delete Account
            </WindowHandler>
          </div>
        </div>
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

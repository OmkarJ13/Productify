import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { signOut, updateProfile } from "firebase/auth";
import { ImagePicker } from "react-file-picker";

import { auth, storage } from "../../firebase.config";
import { Edit, FileUpload, Logout } from "@mui/icons-material";
import DefaultProfile from "../../Images/DefaultProfile.png";
import WindowHandler from "../UI/WindowHandler";
import EmailEditWindow from "./EmailEditWindow";
import UsernameEditWindow from "./UsernameEditWindow";
import ChangePasswordWindow from "./ChangePasswordWindow";
import DeleteAccountWindow from "./DeleteAccountWindow";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.user?.displayName ?? "",
      photoURL: this.props.user?.photoURL ?? "",
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
      photoURL,
    });
  }

  async handleSignOut() {
    await signOut(auth);
    this.props.history.push("/welcome");
  }

  render() {
    const { username, email, photoURL } = this.state;

    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        <div className="w-full h-[75px] flex justify-between items-center p-4 border border-gray-200 shadow-md">
          <h1 className="text-2xl font-bold uppercase">Account</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white"
            onClick={this.handleSignOut}
          >
            <Logout />
            Log Out
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="flex-grow flex flex-col gap-4 justify-center items-center py-4 border-b border-gray-300">
            <div className="flex justify-center items-center gap-8">
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
                  <button className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-full h-full transition-opacity opacity-0 group-hover:opacity-100 text-6xl bg-black bg-opacity-20 text-white rounded-[50%]">
                    <FileUpload fontSize="inherit" />
                  </button>

                  <img
                    src={
                      this.props.user
                        ? this.props.user.photoURL ?? DefaultProfile
                        : DefaultProfile
                    }
                    className="w-[200px] h-[200px] object-cover border border-gray-300 rounded-[50%]"
                  />
                </div>
              </ImagePicker>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>Username</label>
                  <div className="flex justify-between items-center">
                    <span className="w-[250px] px-4 py-2 border-l border-y border-gray-300 rounded-l-md">
                      {username}
                    </span>
                    <WindowHandler
                      className="bg-blue-500 text-white p-2 rounded-r-md"
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

                <div className="flex flex-col gap-2">
                  <label>Your Email</label>
                  <div className="flex justify-between items-center">
                    <span className="w-[250px] px-4 py-2 border-l border-y border-gray-300 rounded-l-md">
                      {email}
                    </span>
                    <WindowHandler
                      className="bg-blue-500 text-white p-2 rounded-r-md"
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
            <span className="text-red-500">{this.state.errorMessage}</span>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center p-2 border-b border-gray-300 last-of-type:border-none">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">Change Password</h1>
                <h2>Update your old password</h2>
              </div>
              <WindowHandler
                className="w-[200px] px-4 py-2 bg-blue-500 text-white rounded-md"
                renderWindow={(otherProps) => {
                  return <ChangePasswordWindow {...otherProps} />;
                }}
              >
                Change Password
              </WindowHandler>
            </div>
            <div className="flex justify-between items-center p-2 border-b border-gray-300 last-of-type:border-none">
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">Delete Account</h1>
                <h2>
                  Deleting your account will permanently delete all of your data
                </h2>
              </div>
              <WindowHandler
                className="w-[200px] px-4 py-2 bg-blue-500 text-white rounded-md"
                renderWindow={(otherProps) => {
                  return (
                    <DeleteAccountWindow
                      onUserDeleted={() => this.props.history.push("/welcome")}
                      {...otherProps}
                    />
                  );
                }}
              >
                Delete Account
              </WindowHandler>
            </div>
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

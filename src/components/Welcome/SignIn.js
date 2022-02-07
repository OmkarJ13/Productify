import React from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Lock, Person } from "@mui/icons-material";

import { auth } from "../../firebase.config";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
    };

    this.handleSignInDetailsChanged =
      this.handleSignInDetailsChanged.bind(this);

    this.handleRememberMeChanged = this.handleRememberMeChanged.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  handleSignInDetailsChanged(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleRememberMeChanged(e) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  async signIn() {
    const { email, password, rememberMe } = this.state;

    if (!rememberMe) {
      await auth.setPersistence(browserSessionPersistence);
    } else {
      await auth.setPersistence(browserLocalPersistence);
    }

    await signInWithEmailAndPassword(auth, email, password);
  }

  render() {
    const { email, password, rememberMe } = this.state;

    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="mb-4 text-2xl font-bold uppercase">
          Sign In to get started
        </h1>
        <div className="flex flex-col gap-2 mb-8">
          <div className="w-[300px] flex items-center gap-2 p-2 border border-gray-300">
            <input
              type="text"
              name="email"
              className="flex-grow outline-none"
              placeholder="Enter email"
              value={email}
              onChange={this.handleSignInDetailsChanged}
            />
            <Person fontSize="small" />
          </div>
          <div className="w-[300px] flex items-center gap-2 p-2 border border-gray-300">
            <input
              type="password"
              name="password"
              className="flex-grow outline-none"
              placeholder="Enter password"
              value={password}
              onChange={this.handleSignInDetailsChanged}
            />
            <Lock fontSize="small" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember-me"
                value={rememberMe}
                onChange={this.handleRememberMeChanged}
              />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <button
              className="bg-transperent"
              onClick={this.props.onForgotPasswordClicked}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button
          className="w-[300px] px-4 py-2 mb-4 rounded-md bg-blue-500 text-white"
          onClick={this.signIn}
        >
          Sign In
        </button>

        <div className="text-sm">
          Not registered yet?{" "}
          <button onClick={this.props.onSignUpClicked}>Sign Up.</button>
        </div>
      </div>
    );
  }
}

export default SignIn;

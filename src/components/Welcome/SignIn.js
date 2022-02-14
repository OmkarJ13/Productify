import React from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Lock, Person } from "@mui/icons-material";

import { auth } from "../../firebase.config";
import { firebaseErrors } from "../../helpers/firebaseErrors";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: false,
      errorMessage: "",
    };

    this.handleSignInDetailsChanged =
      this.handleSignInDetailsChanged.bind(this);

    this.handleRememberMeChanged = this.handleRememberMeChanged.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  handleSignInDetailsChanged(e) {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: "",
    });
  }

  handleRememberMeChanged(e) {
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  async signIn() {
    try {
      const { email, password, rememberMe } = this.state;

      if (!rememberMe) {
        await auth.setPersistence(browserSessionPersistence);
      } else {
        await auth.setPersistence(browserLocalPersistence);
      }

      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  render() {
    const { email, password, rememberMe, errorMessage } = this.state;

    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold uppercase">
          Sign In to get started
        </h1>
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex w-[300px] items-center gap-2 border border-gray-300 p-2">
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
          <div className="flex w-[300px] items-center gap-2 border border-gray-300 p-2">
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

          <div className="flex items-center justify-between text-sm">
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

          <span className="w-[300px] text-sm text-red-500">{errorMessage}</span>
        </div>

        <button
          className="mb-4 w-[300px] rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={this.signIn}
          disabled={email === "" || password === ""}
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

import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Lock, Person } from "@mui/icons-material";

import { auth } from "../../firebase.config";
import { firebaseErrors } from "../../helpers/firebaseErrors";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
    };

    this.handleSignUpDetailsChanged =
      this.handleSignUpDetailsChanged.bind(this);

    this.signUp = this.signUp.bind(this);
  }

  handleSignUpDetailsChanged(e) {
    this.setState({
      [e.target.name]: e.target.value,
      errorMessage: "",
    });
  }

  async signUp() {
    try {
      const { email, password } = this.state;
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      this.setState({
        errorMessage: firebaseErrors[e.code],
      });
    }
  }

  render() {
    const { email, password, errorMessage } = this.state;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold uppercase">
          Sign Up on Productify
        </h1>
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex w-[300px] items-center gap-2 border border-gray-300 p-2">
            <input
              type="text"
              name="email"
              className="flex-grow outline-none"
              placeholder="Enter email"
              value={email}
              onChange={this.handleSignUpDetailsChanged}
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
              onChange={this.handleSignUpDetailsChanged}
            />
            <Lock fontSize="small" />
          </div>

          <span className="w-[300px] text-sm text-red-500">{errorMessage}</span>
        </div>
        <button
          className="mb-4 w-[300px] rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-500"
          onClick={this.signUp}
          disabled={email === "" || password === ""}
        >
          Sign Up
        </button>

        <div className="text-sm">
          Already have an account?{" "}
          <button onClick={this.props.onSignInClicked}>Sign In.</button>
        </div>
      </div>
    );
  }
}

export default SignUp;

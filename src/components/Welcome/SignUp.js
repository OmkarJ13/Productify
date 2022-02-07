import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Lock, Person } from "@mui/icons-material";

import { auth } from "../../firebase.config";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.handleSignUpDetailsChanged =
      this.handleSignUpDetailsChanged.bind(this);

    this.signUp = this.signUp.bind(this);
  }

  handleSignUpDetailsChanged(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async signUp() {
    const { email, password } = this.state;
    await createUserWithEmailAndPassword(auth, email, password);
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h1 className="mb-4 text-2xl font-bold uppercase">
          Sign Up on Productify
        </h1>
        <div className="flex flex-col gap-2 mb-8">
          <div className="w-[300px] flex items-center gap-2 p-2 border border-gray-300">
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
          <div className="w-[300px] flex items-center gap-2 p-2 border border-gray-300">
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
        </div>
        <button
          className="w-[300px] px-4 py-2 mb-4 rounded-md bg-blue-500 text-white"
          onClick={this.signUp}
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

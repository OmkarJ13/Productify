import React from "react";

import TimeManagement from "../../Images/TimeManagement.svg";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingAccount: false,
    };

    this.toggleCreatingAccount = this.toggleCreatingAccount.bind(this);
  }

  toggleCreatingAccount() {
    this.setState((prevState) => {
      return {
        creatingAccount: !prevState.creatingAccount,
      };
    });
  }

  componentDidMount() {
    document.title = "Welcome | Productify";
  }

  render() {
    const { creatingAccount } = this.state;

    return (
      <div className="w-full h-screen flex">
        <div className="w-1/2 h-full flex flex-col justify-center items-center gap-4 bg-gray-500 text-white">
          <img src={TimeManagement} className="w-[60%]" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold">Productify</h1>
            <h2 className="text-xl font-light">
              The only productivity tool you will ever need.
            </h2>
          </div>
        </div>
        <div className="w-1/2 h-full bg-white text-gray-600">
          {creatingAccount ? (
            <SignUp onSignInClicked={this.toggleCreatingAccount} />
          ) : (
            <SignIn onSignUpClicked={this.toggleCreatingAccount} />
          )}
        </div>
      </div>
    );
  }
}

export default Welcome;

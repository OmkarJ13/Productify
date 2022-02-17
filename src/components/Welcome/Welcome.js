import React from "react";

import TimeManagement from "../../Images/TimeManagement.svg";
import ForgotPassword from "./ForgotPassword";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creatingAccount: false,
      forgotPassword: false,
    };

    this.toggleCreatingAccount = this.toggleCreatingAccount.bind(this);
    this.toggleForgotPassword = this.toggleForgotPassword.bind(this);
  }

  toggleCreatingAccount() {
    this.setState((prevState) => {
      return {
        creatingAccount: !prevState.creatingAccount,
      };
    });
  }

  toggleForgotPassword() {
    this.setState((prevState) => {
      return {
        forgotPassword: !prevState.forgotPassword,
      };
    });
  }

  componentDidMount() {
    document.title = "Welcome | Productify";
  }

  render() {
    const { creatingAccount, forgotPassword } = this.state;

    return (
      <div className="flex h-screen w-full flex-col lg:flex-row">
        <div className="hidden h-full w-1/2 flex-col items-center justify-center gap-4 bg-gray-500 text-white lg:flex">
          <img src={TimeManagement} className="w-[60%]" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-black">Productify</h1>
            <h2 className="">The only productivity tool you will ever need.</h2>
          </div>
        </div>
        <div className="flex h-full w-full items-center justify-center bg-white text-gray-600 lg:w-1/2">
          {creatingAccount ? (
            <SignUp onSignInClicked={this.toggleCreatingAccount} />
          ) : forgotPassword ? (
            <ForgotPassword onSignInClicked={this.toggleForgotPassword} />
          ) : (
            <SignIn
              onSignUpClicked={this.toggleCreatingAccount}
              onForgotPasswordClicked={this.toggleForgotPassword}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Welcome;

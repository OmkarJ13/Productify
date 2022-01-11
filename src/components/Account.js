import React from "react";

class Tags extends React.Component {
  componentDidMount() {
    document.title = "Account | Productify";
  }

  render() {
    return (
      <div className="w-10/12 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <h2>Account</h2>
      </div>
    );
  }
}

export default Tags;

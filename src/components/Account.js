import React from "react";

class Tags extends React.Component {
  componentDidMount() {
    document.title = "Account | Productify";
  }

  render() {
    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        <h2>Account</h2>
      </div>
    );
  }
}

export default Tags;

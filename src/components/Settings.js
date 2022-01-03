import React from "react";

class Settings extends React.Component {
  componentDidMount() {
    document.title = "Settings | Productify";
  }

  render() {
    return (
      <div className="w-10/12 min-h-screen flex flex-col ml-auto p-8 text-gray-600">
        <h2>Settings</h2>
      </div>
    );
  }
}

export default Settings;

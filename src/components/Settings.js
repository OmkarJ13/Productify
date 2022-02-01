import React from "react";

class Settings extends React.Component {
  componentDidMount() {
    document.title = "Settings | Productify";
  }

  render() {
    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        <h2>Settings</h2>
      </div>
    );
  }
}

export default Settings;

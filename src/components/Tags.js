import React from "react";

class Tags extends React.Component {
  componentDidMount() {
    document.title = "Tags | Productify";
  }

  render() {
    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        <h2>Tags</h2>
      </div>
    );
  }
}

export default Tags;

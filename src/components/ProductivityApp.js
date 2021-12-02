import React from "react";
import "./ProductivityApp.css";

import NavBar from "./NavBar";
import SideBar from "./SideBar";
import TimeTracker from "./TimeTracker";

class ProductivityApp extends React.Component {
  render() {
    return (
      <div className="ProductivityApp">
        <NavBar />
        <SideBar />
        <TimeTracker />
      </div>
    );
  }
}

export default ProductivityApp;

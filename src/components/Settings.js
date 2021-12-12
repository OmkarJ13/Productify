import React from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import "./Settings.css";

class Settings extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme, changeTheme }) => {
          return (
            <div className="Settings flex-column justify-center">
              <h2>Settings</h2>
              <ul className="Settings__list">
                <li className="flex">
                  <input type="checkbox" onChange={changeTheme} />
                  Enable Dark Mode
                </li>
              </ul>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default Settings;

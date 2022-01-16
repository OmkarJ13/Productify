import React from "react";
import { ContentCopy, Delete } from "@mui/icons-material";

import FloatingWindow from "../UI/FloatingWindow";

class TimerEntryOptionsWindow extends React.Component {
  render() {
    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        anchorEl={this.props.anchorEl}
      >
        <ul>
          <li>
            <button
              onClick={this.props.onDuplicate}
              className="w-full flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <ContentCopy fontSize="small" />
              Duplicate
            </button>
          </li>
          <li>
            <button
              onClick={this.props.onDelete}
              className="w-full flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <Delete fontSize="small" />
              Delete
            </button>
          </li>
        </ul>
      </FloatingWindow>
    );
  }
}

export default TimerEntryOptionsWindow;

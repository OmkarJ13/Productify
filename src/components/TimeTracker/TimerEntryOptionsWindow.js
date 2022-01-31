import React from "react";
import { ContentCopy, Delete } from "@mui/icons-material";

import FloatingWindow from "../UI/FloatingWindow";

class TimerEntryOptionsWindow extends React.Component {
  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onDuplicate = this.onDuplicate.bind(this);
  }

  onDelete() {
    this.props.onDelete();
    this.props.onClose();
  }

  onDuplicate() {
    this.props.onDuplicate();
    this.props.onClose();
  }

  render() {
    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        buttonRef={this.props.buttonRef}
      >
        <ul>
          <li>
            <button
              onClick={this.onDuplicate}
              className="w-full flex items-center gap-2 px-6 py-2 bg-white hover:bg-gray-200 text-gray-600 text-left"
            >
              <ContentCopy fontSize="small" />
              Duplicate
            </button>
          </li>
          <li>
            <button
              onClick={this.onDelete}
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

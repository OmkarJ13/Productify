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
              className="flex w-full items-center gap-2 bg-white px-6 py-2 text-left text-gray-600 hover:bg-gray-200"
            >
              <ContentCopy fontSize="small" />
              Duplicate
            </button>
          </li>
          <li>
            <button
              onClick={this.onDelete}
              className="flex w-full items-center gap-2 bg-white px-6 py-2 text-left text-gray-600 hover:bg-gray-200"
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

import { Delete, Edit } from "@mui/icons-material";
import React from "react";
import FloatingWindow from "../UI/FloatingWindow";

class TagOptionsWindow extends React.Component {
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
              className="w-full px-6 py-2 flex items-center gap-2 text-left hover:bg-gray-200"
              onClick={() => {
                this.props.onEdit();
                this.props.onClose();
              }}
            >
              <Edit />
              Edit
            </button>
          </li>
          <li>
            <button
              className="w-full px-6 py-2 flex items-center gap-2 text-left hover:bg-gray-200"
              onClick={() => {
                this.props.onDelete();
                this.props.onClose();
              }}
            >
              <Delete />
              Delete
            </button>
          </li>
        </ul>
      </FloatingWindow>
    );
  }
}

export default TagOptionsWindow;

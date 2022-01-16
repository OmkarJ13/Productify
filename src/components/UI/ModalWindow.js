import React from "react";

import { Cancel } from "@mui/icons-material";
import Overlay from "./Overlay";
import reactDom from "react-dom";

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.windowPortal = document.getElementById("window-portal");
  }

  render() {
    const { open } = this.props;

    return open ? (
      <>
        <Overlay onClick={this.props.onClose} opacity={0.5} zIndex={15} />
        {reactDom.createPortal(
          <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] max-w-[50%] flex flex-col gap-2 z-20 bg-white shadow-xl animate-[fade_ease-in-out_250ms] border border-gray-200">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={this.props.onClose}
            >
              <Cancel />
            </button>
            <div className="w-full h-full p-4">{this.props.children}</div>
          </div>,
          this.windowPortal
        )}
      </>
    ) : null;
  }
}

export default ModalWindow;

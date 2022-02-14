import React from "react";
import reactDom from "react-dom";
import { Cancel } from "@mui/icons-material";

import Overlay from "./Overlay";

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
          <div className="fixed top-1/2 left-1/2 z-20 flex max-w-[50%] translate-x-[-50%] translate-y-[-50%] animate-[fade_ease-in-out_250ms] flex-col gap-2 border border-gray-200 bg-white shadow-xl">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={this.props.onClose}
            >
              <Cancel />
            </button>
            <div className="h-full w-full p-4">{this.props.children}</div>
          </div>,
          this.windowPortal
        )}
      </>
    ) : null;
  }
}

export default ModalWindow;

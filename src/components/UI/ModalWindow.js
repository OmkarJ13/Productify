import React from "react";
import { Cancel } from "@mui/icons-material";

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black bg-opacity-70">
        <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] max-w-[50%] flex flex-col gap-2 z-20 bg-white shadow-xl">
          <button
            className="absolute top-2 right-2 text-red-500"
            onClick={this.props.onCancel}
          >
            <Cancel />
          </button>
          <h2 className="w-full flex gap-2 p-4 text-blue-500 text-2xl font-bold uppercase border-b border-gray-300">
            {this.props.heading}
          </h2>
          <div className="w-full p-4 flex flex-col gap-4">
            {this.props.children}
          </div>
          <div className="self-end p-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white"
              onClick={this.props.onConfirm}
            >
              {typeof this.props.confirmText === "string"
                ? this.props.confirmText
                : typeof this.props.confirmText === "function"
                ? this.props.confirmText()
                : ""}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalWindow;

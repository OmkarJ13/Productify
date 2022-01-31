import React from "react";
import { LocalOffer, Done } from "@mui/icons-material";

import ModalWindow from "../UI/ModalWindow";
import { colors } from "../../helpers/colors";

class TagCreatorWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isValid: true,
      tag: {
        name: "",
        color: "#000000",
      },
    };

    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.colorChangeHandler = this.colorChangeHandler.bind(this);
    this.tagCreatedHandler = this.tagCreatedHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      tag: {
        ...this.state.tag,
        color: colors[0],
      },
    });
  }

  nameChangeHandler(e) {
    const tags = JSON.parse(localStorage.getItem("tags"));
    const exists = tags.some((cur) => cur.name === e.target.value);
    if (exists) {
      this.setState({
        isValid: false,
      });
    } else if (!this.state.isValid) {
      this.setState({
        isValid: true,
      });
    }

    this.setState({
      tag: {
        ...this.state.tag,
        name: e.target.value,
      },
    });
  }

  colorChangeHandler(e) {
    const clicked = e.target.closest("button");

    if (clicked) {
      this.setState({
        tag: {
          ...this.state.tag,
          color: clicked.dataset.color,
        },
      });
    }
  }

  tagCreatedHandler(e) {
    this.props.onClose();
    this.props.onTagCreated(this.state.tag);
  }

  render() {
    return (
      <ModalWindow open={this.props.open} onClose={this.props.onClose}>
        <div className="flex flex-col gap-4">
          <h2 className="w-full flex gap-2 text-blue-500 text-2xl font-bold uppercase border-b border-gray-300">
            Create A New Tag
          </h2>
          <div className="flex flex-col items-start gap-2">
            <label>Tag Name</label>
            <input
              type="text"
              placeholder="e.g. Study"
              onChange={this.nameChangeHandler}
              className={`w-full p-1 border border-gray-300 focus:outline-none ${
                !this.state.isValid && "border-red-500"
              }`}
            />

            <span
              className={`self-start text-xs text-red-500 ${
                this.state.isValid ? "hidden" : "block"
              }`}
            >
              Tag Already Exists!
            </span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label>Color</label>

            <div className="grid grid-cols-8">
              {colors.map((color) => {
                return (
                  <button
                    key={color}
                    onClick={this.colorChangeHandler}
                    data-color={color}
                    className={"relative w-[35px] h-[35px]"}
                    style={{ backgroundColor: `${color}` }}
                  >
                    <Done
                      className={`absolute top-0 left-0 z-10 border-2 border-white opacity-0 ${
                        this.state.tag.color === color && "opacity-100"
                      } text-white`}
                      fontSize="large"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white disabled:bg-gray-400"
            onClick={this.tagCreatedHandler}
            disabled={this.state.tag.name === "" || !this.state.isValid}
          >
            <LocalOffer /> Save
          </button>
        </div>
      </ModalWindow>
    );
  }
}

export default TagCreatorWindow;

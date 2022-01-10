import React from "react";
import { LocalOffer, Done } from "@mui/icons-material";

import ModalWindow from "../UI/ModalWindow";
import { colors } from "../../helpers/colors";

class TagCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      color: "#000000",
    };

    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.colorChangeHandler = this.colorChangeHandler.bind(this);
    this.tagCreatedHandler = this.tagCreatedHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      color: colors[0],
    });
  }

  nameChangeHandler(e) {
    this.setState({
      name: e.target.value,
    });
  }

  colorChangeHandler(e) {
    const clicked = e.target.closest("button");

    if (clicked) {
      this.setState({
        color: clicked.dataset.color,
      });
    }
  }

  tagCreatedHandler(e) {
    this.props.onTagCreated(this.state);
  }

  render() {
    return (
      <ModalWindow
        heading={"Create A New Tag"}
        confirmText={() => (
          <>
            <LocalOffer /> Create Tag
          </>
        )}
        onClose={this.props.onClose}
        onConfirm={this.tagCreatedHandler}
      >
        <div className="flex flex-col gap-2">
          <label>Tag Name</label>
          <input
            type="text"
            placeholder="e.g. Study"
            onChange={this.nameChangeHandler}
            className="p-1 border border-gray-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>Color</label>

          <div>
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
                      this.state.color === color && "opacity-100"
                    } text-white`}
                    fontSize="large"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </ModalWindow>
    );
  }
}

export default TagCreator;

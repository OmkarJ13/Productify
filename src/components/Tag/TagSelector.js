import React from "react";
import { LocalOffer } from "@mui/icons-material";

import TagSelectorWindow from "./TagSelectorWindow";
import WindowHandler from "../UI/WindowHandler";

class TagSelector extends React.Component {
  render() {
    const { value, onChange, ...otherProps } = this.props;

    return (
      <WindowHandler
        {...otherProps}
        renderWindow={(otherProps) => (
          <TagSelectorWindow onTagSelected={onChange} {...otherProps} />
        )}
      >
        {value === undefined ? (
          <div className="w-full flex justify-center items-center gap-2 px-2 py-1 rounded-full bg-gray-400 text-white">
            <LocalOffer fontSize="small" />
            <span className="text-xs">Add Tag</span>
          </div>
        ) : (
          <div
            className="w-full flex justify-center items-center gap-2 px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: value.color }}
          >
            <LocalOffer fontSize="small" />
            <span className="max-w-full text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {value.name}
            </span>
          </div>
        )}
      </WindowHandler>
    );
  }
}

export default TagSelector;

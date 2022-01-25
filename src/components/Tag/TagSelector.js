import React from "react";
import { LocalOffer } from "@mui/icons-material";

import TagSelectorWindow from "./TagSelectorWindow";
import FloatingWindowHandler from "../UI/FloatingWindowHandler";

class TagSelector extends React.Component {
  render() {
    const { initialTag, onTagSelected, ...otherProps } = this.props;

    return (
      <FloatingWindowHandler
        {...otherProps}
        Window={(otherProps) => (
          <TagSelectorWindow onTagSelected={onTagSelected} {...otherProps} />
        )}
      >
        {initialTag === undefined ? (
          <div className="w-full flex justify-center items-center gap-2">
            <LocalOffer />
            <span className="text-xs">Add Tag</span>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center gap-2">
            <LocalOffer htmlColor={initialTag.color} fontSize="small" />
            <span className="flex-grow text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {initialTag.name}
            </span>
          </div>
        )}
      </FloatingWindowHandler>
    );
  }
}

export default TagSelector;

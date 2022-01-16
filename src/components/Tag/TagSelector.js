import React from "react";
import { LocalOffer } from "@mui/icons-material";

import TagSelectorWindow from "./TagSelectorWindow";
import FloatingWindowHandler from "../UI/FloatingWindowHandler";

class TagSelector extends React.Component {
  render() {
    const { className, initialTag } = this.props;

    return (
      <FloatingWindowHandler
        className={className}
        Window={(otherProps) => (
          <TagSelectorWindow
            onTagSelected={this.props.onTagSelected}
            {...otherProps}
          />
        )}
      >
        {initialTag === undefined ? (
          <div className="w-full flex justify-center items-center gap-2">
            <LocalOffer />
            <span className="text-xs">Add Tag</span>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center gap-2">
            <LocalOffer htmlColor={initialTag.color} fontSize="small" />
            <span className="text-xs">{initialTag.name}</span>
          </div>
        )}
      </FloatingWindowHandler>
    );
  }
}

export default TagSelector;

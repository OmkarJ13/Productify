import React from "react";
import { LocalOffer } from "@mui/icons-material";
import { connect } from "react-redux";

import TagSelectorWindow from "./TagSelectorWindow";
import WindowHandler from "../UI/WindowHandler";

class TagSelector extends React.Component {
  getTag(id) {
    const { tags } = this.props;
    return tags.find((x) => x.id === id);
  }

  render() {
    const { value, onChange, ...otherProps } = this.props;
    const tag = this.getTag(value);

    return (
      <WindowHandler
        {...otherProps}
        renderWindow={(otherProps) => (
          <TagSelectorWindow onTagSelected={onChange} {...otherProps} />
        )}
      >
        {!tag ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-400 px-2 py-1 text-white">
            <LocalOffer fontSize="small" />
            <span className="text-xs">Add Tag</span>
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center gap-2 rounded-full px-2 py-1 text-white"
            style={{ backgroundColor: tag.color }}
          >
            <LocalOffer fontSize="small" />
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              {tag.name}
            </span>
          </div>
        )}
      </WindowHandler>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tagReducer.tags,
  };
};

export default connect(mapStateToProps, null)(TagSelector);

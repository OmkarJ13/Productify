import React from "react";
import { LocalOffer } from "@mui/icons-material";

import TagSelectorWindow from "./TagSelectorWindow";
import WindowHandler from "../UI/WindowHandler";
import { connect } from "react-redux";

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
          <div className="w-full flex justify-center items-center gap-2 px-2 py-1 rounded-full bg-gray-400 text-white">
            <LocalOffer fontSize="small" />
            <span className="text-xs">Add Tag</span>
          </div>
        ) : (
          <div
            className="w-full flex justify-center items-center gap-2 px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: tag.color }}
          >
            <LocalOffer fontSize="small" />
            <span className="max-w-full text-xs overflow-hidden text-ellipsis whitespace-nowrap">
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

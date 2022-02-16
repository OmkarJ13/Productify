import React from "react";
import { LocalOffer, MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";

import { deleteTagAsync, updateTagAsync } from "../../store/slices/tagSlice";
import TagCreatorWindow from "../Tag/TagCreatorWindow";
import TagOptionsWindow from "./TagOptionsWindow";
import WindowHandler from "../UI/WindowHandler";

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };

    this.toggleEditor = this.toggleEditor.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  toggleEditor() {
    this.setState((prevState) => {
      return {
        isEditing: !prevState.isEditing,
      };
    });
  }

  handleEdit(tag) {
    console.log(tag);
    this.props.updateTag(tag);
  }

  handleDelete() {
    this.props.deleteTag(this.props.tag);
  }

  render() {
    const { tag } = this.props;

    return (
      <>
        {this.state.isEditing && (
          <TagCreatorWindow
            open={this.state.isEditing}
            onClose={this.toggleEditor}
            tag={tag}
            onTagCreated={this.handleEdit}
          />
        )}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-2">
          <div className="flex items-center gap-2">
            <LocalOffer htmlColor={tag.color} />
            <span className="w-[200px] overflow-x-clip overflow-ellipsis">
              {tag.name}
            </span>
          </div>
          <div>
            <WindowHandler
              renderWindow={(otherProps) => {
                return (
                  <TagOptionsWindow
                    {...otherProps}
                    onEdit={this.toggleEditor}
                    onDelete={this.handleDelete}
                  />
                );
              }}
            >
              <MoreVert />
            </WindowHandler>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTag: (tag) => {
      dispatch(deleteTagAsync(tag));
    },

    updateTag: (tag) => {
      dispatch(updateTagAsync(tag));
    },
  };
};

export default connect(null, mapDispatchToProps)(Tag);

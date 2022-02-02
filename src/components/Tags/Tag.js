import { LocalOffer, MoreVert } from "@mui/icons-material";
import React from "react";
import { connect } from "react-redux";
import { tagActions } from "../../store/slices/tagSlice";
import TagCreatorWindow from "../Tag/TagCreatorWindow";
import WindowHandler from "../UI/WindowHandler";
import TagOptionsWindow from "./TagOptionsWindow";

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
    this.props.updateTag(tag);
  }

  handleDelete() {
    this.props.deleteTag(this.props.tag);
  }

  render() {
    const { tag, duration, tasksDone, revenue } = this.props;
    return (
      <>
        {this.state.isEditing && (
          <TagCreatorWindow
            open={this.state.isEditing}
            onClose={this.toggleEditor}
            isEditing={true}
            tag={tag}
            onTagCreated={this.handleEdit}
          />
        )}
        <tr className="flex items-center gap-4 p-2 border-b border-gray-200">
          <td className="flex-grow flex items-center gap-2">
            <LocalOffer htmlColor={tag.color} />
            {tag.name}
          </td>
          <div className="w-[300px] flex items-center gap-4">
            <td className="w-1/3 text-center">{duration.toFixed(1)}h</td>
            <td className="w-1/3 text-center">
              {`${tasksDone[0]} / ${tasksDone[1]}`}
            </td>
            <td className="w-1/3 text-center">{revenue}</td>
          </div>
          <td>
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
          </td>
        </tr>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteTag: (tag) => {
      dispatch(tagActions.delete(tag));
    },

    updateTag: (tag) => {
      dispatch(tagActions.update(tag));
    },
  };
};

export default connect(null, mapDispatchToProps)(Tag);

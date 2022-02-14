import React from "react";
import { connect } from "react-redux";
import { AddCircle, LocalOffer, Search } from "@mui/icons-material";

import { addTagAsync } from "../../store/slices/tagSlice";
import FloatingWindow from "../UI/FloatingWindow";
import TagCreatorWindow from "./TagCreatorWindow";
import WindowHandler from "../UI/WindowHandler";

class TagSelectorWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
    };

    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.handleTagCreated = this.handleTagCreated.bind(this);
    this.handleTagSelected = this.handleTagSelected.bind(this);
  }

  handleSearchQuery(e) {
    this.setState({
      searchQuery: e.target.value,
    });
  }

  filterTags(tags) {
    const { searchQuery } = this.state;
    if (searchQuery === "") return tags;

    return tags.filter(
      (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
    );
  }

  handleTagCreated(tag) {
    this.props.addTag(tag);
  }

  handleTagSelected(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      const tagID = clicked.dataset.id;
      this.props.onTagSelected(tagID);
      this.props.onClose();
    }
  }

  hasMadeChanges(prevProps) {
    return JSON.stringify(prevProps.tags) !== JSON.stringify(this.props.tags);
  }

  componentDidUpdate(prevProps) {
    if (this.hasMadeChanges(prevProps)) {
      localStorage.setItem("tags", JSON.stringify(this.props.tags));
    }
  }

  render() {
    const { tags } = this.props;
    const results = this.filterTags(tags);

    return (
      <FloatingWindow
        open={this.props.open}
        onClose={this.props.onClose}
        buttonRef={this.props.buttonRef}
      >
        <div className="flex flex-col gap-4 p-4 text-sm">
          <div className="flex items-center gap-1 border border-gray-300 px-1 py-2">
            <Search />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow focus:outline-none"
              onChange={this.handleSearchQuery}
            ></input>
          </div>

          <div className="flex max-h-[25vh] w-[20vw] flex-col overflow-y-auto py-2">
            {results.length === 0 && "No Tags Found"}
            {results.length > 0 &&
              results.map((tag) => {
                return (
                  <button
                    key={tag.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-200"
                    onClick={this.handleTagSelected}
                    data-id={tag.id}
                  >
                    <LocalOffer htmlColor={tag.color} />
                    <span className="text-md w-full overflow-hidden overflow-ellipsis text-left">
                      {tag.name}
                    </span>
                  </button>
                );
              })}
          </div>

          <WindowHandler
            className="flex w-full items-center justify-center gap-2 text-blue-500"
            renderWindow={(otherProps) => {
              return (
                <TagCreatorWindow
                  onTagCreated={this.handleTagCreated}
                  {...otherProps}
                />
              );
            }}
          >
            <AddCircle /> Create A New Tag
          </WindowHandler>
        </div>
      </FloatingWindow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tagReducer.tags,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: (tag) => {
      dispatch(addTagAsync(tag));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagSelectorWindow);

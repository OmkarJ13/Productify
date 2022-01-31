import React from "react";
import { connect } from "react-redux";
import { AddCircle, LocalOffer, Search } from "@mui/icons-material";

import { tagActions } from "../../store/slices/tagSlice";
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
      const tag = JSON.parse(clicked.dataset.tag);
      this.props.onTagSelected(tag);
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
          <div className="px-1 py-2 flex gap-1 items-center border border-gray-300">
            <Search />
            <input
              type="text"
              placeholder="Search"
              className="focus:outline-none flex-grow"
              onChange={this.handleSearchQuery}
            ></input>
          </div>

          <div className="w-[20vw] max-h-[25vh] py-2 flex flex-col overflow-y-auto">
            {results.length === 0 && "No Tags Found"}
            {results.length > 0 &&
              results.map((tag) => {
                return (
                  <button
                    key={tag.name}
                    className="p-2 flex items-center gap-2 hover:bg-gray-200"
                    onClick={this.handleTagSelected}
                    data-tag={JSON.stringify(tag)}
                  >
                    <LocalOffer htmlColor={tag.color} />
                    <span className="text-md w-full text-left overflow-hidden overflow-ellipsis">
                      {tag.name}
                    </span>
                  </button>
                );
              })}
          </div>

          <WindowHandler
            className="w-full flex justify-center items-center gap-2 text-blue-500"
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
      dispatch(tagActions.create(tag));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TagSelectorWindow);

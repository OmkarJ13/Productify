import React from "react";
import { connect } from "react-redux";

import { AddCircle, LocalOffer, Search } from "@mui/icons-material";

import { tagActions } from "../../store/slices/tagSlice";
import TagCreator from "./TagCreator";
import FloatingWindow from "../UI/FloatingWindow";

class TagSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      creatingTag: false,
    };

    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.openTagCreator = this.openTagCreator.bind(this);
    this.closeTagCreator = this.closeTagCreator.bind(this);
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

  openTagCreator() {
    this.setState({
      creatingTag: true,
    });
  }

  closeTagCreator() {
    this.setState({
      creatingTag: false,
    });
  }

  handleTagCreated(tag) {
    this.props.addTag(tag);
    this.closeTagCreator();
  }

  handleTagSelected(e) {
    const clicked = e.target.closest("a");
    if (clicked) {
      const tag = JSON.parse(clicked.dataset.tag);
      this.props.onTagSelected(tag);
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
      <FloatingWindow onClose={this.props.onClose}>
        {this.state.creatingTag && (
          <TagCreator
            onClose={this.closeTagCreator}
            onTagCreated={this.handleTagCreated}
          />
        )}

        <div className="flex flex-col gap-4 p-4">
          <div className="px-1 py-2 flex gap-1 items-center border border-gray-300">
            <Search />
            <input
              type="text"
              placeholder="Search"
              className="focus:outline-none flex-grow"
              onChange={this.handleSearchQuery}
            ></input>
          </div>

          <div className="py-2 flex flex-col min-w-[20vw] max-h-[25vh] overflow-y-auto">
            {results.length === 0 && "No Tags Found"}
            {results.length > 0 &&
              results.map((tag) => {
                return (
                  <a
                    key={tag.name}
                    className="p-2 flex items-center gap-2 hover:bg-gray-200"
                    onClick={this.handleTagSelected}
                    data-tag={JSON.stringify(tag)}
                  >
                    <LocalOffer htmlColor={tag.color} />
                    <span className="text-md">{tag.name}</span>
                  </a>
                );
              })}
          </div>

          <button
            className="flex gap-2 justify-center items-center text-blue-500"
            onClick={this.openTagCreator}
          >
            <AddCircle /> Create A New Tag
          </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TagSelector);

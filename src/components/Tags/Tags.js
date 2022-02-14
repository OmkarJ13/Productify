import {
  Add,
  LocalOffer,
  Sync,
  Search,
  ArrowCircleDown,
  ArrowCircleUp,
} from "@mui/icons-material";
import React from "react";
import { connect } from "react-redux";

import { addTagAsync } from "../../store/slices/tagSlice";
import TagCreatorWindow from "../Tag/TagCreatorWindow";
import WindowHandler from "../UI/WindowHandler";
import NoData from "../UI/NoData";
import Tag from "./Tag";

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      sortAscending: true,
    };

    this.handleTagCreated = this.handleTagCreated.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
  }

  componentDidMount() {
    document.title = "Tags | Productify";
  }

  handleSearchQuery(e) {
    this.setState({
      searchQuery: e.target.value,
    });
  }

  generateTags(tags) {
    if (!tags || tags.length === 0) return null;
    const { sortAscending } = this.state;

    return (
      <div>
        <div className="flex items-center gap-4 border-b border-gray-300 p-2">
          <div className="group flex-grow">
            <button
              className="flex items-center gap-4 text-center"
              name="alpha"
              onClick={this.handleSort}
            >
              <span className="flex items-center gap-2">
                <LocalOffer /> Name
              </span>

              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                {sortAscending ? <ArrowCircleDown /> : <ArrowCircleUp />}
              </div>
            </button>
          </div>
        </div>

        {tags.map((tag) => {
          return <Tag key={tag.id} tag={tag} />;
        })}
      </div>
    );
  }

  handleTagCreated(tag) {
    this.props.addTag(tag);
  }

  sortTags(tags) {
    const { sortAscending } = this.state;
    return tags.slice().sort((a, b) => {
      return sortAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  }

  handleSort(e) {
    this.setState((prevState) => {
      return {
        sortAscending: !prevState.sortAscending,
      };
    });
  }

  filterTags(tags) {
    const { searchQuery } = this.state;
    if (searchQuery === "") return tags;

    return tags.filter(
      (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
    );
  }

  render() {
    const { tags } = this.props;

    const filteredTags = this.filterTags(tags);
    const sortedTags = this.sortTags(filteredTags);
    const tagsJSX = this.generateTags(sortedTags);

    return (
      <div className="ml-auto flex min-h-screen w-[85%] flex-col gap-6 p-6 text-gray-600">
        <div className="flex h-[75px] w-full items-center justify-between border border-gray-200 p-4 shadow-md">
          <h1 className="text-2xl font-bold uppercase">Tags</h1>
          <WindowHandler
            className="rounded-md bg-gradient-to-br from-blue-500 to-blue-400 px-4 py-2 text-white"
            renderWindow={(otherProps) => {
              return (
                <TagCreatorWindow
                  onTagCreated={this.handleTagCreated}
                  {...otherProps}
                />
              );
            }}
          >
            <Add /> Create Tag
          </WindowHandler>
        </div>
        <div className="flex items-center gap-2 border border-gray-300 p-2">
          <Search />
          <input
            type="text"
            className="flex-grow outline-none"
            placeholder="Search"
            onChange={this.handleSearchQuery}
          />
        </div>

        <div className="flex flex-grow flex-col">
          {tagsJSX && tagsJSX}
          {!tagsJSX && this.props.loading && (
            <Sync
              className="m-auto animate-spin text-blue-500"
              fontSize="large"
            />
          )}
          {!tagsJSX && !this.props.loading && <NoData text="No Tags" />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tagReducer.tags,
    loading: state.tagReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: (tag) => {
      dispatch(addTagAsync(tag));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tags);

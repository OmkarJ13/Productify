import {
  Add,
  LocalOffer,
  MoreVert,
  Search,
  ArrowCircleDown,
  ArrowCircleUp,
  SwapVerticalCircleOutlined,
} from "@mui/icons-material";
import { Duration } from "luxon";
import React from "react";
import { connect } from "react-redux";
import { groupObjectArrayBy } from "../../helpers/groupObjectArrayBy";
import { tagActions } from "../../store/slices/tagSlice";
import TagCreatorWindow from "../Tag/TagCreatorWindow";
import NoData from "../UI/NoData";
import WindowHandler from "../UI/WindowHandler";
import Tag from "./Tag";

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      sortBy: "alpha",
      sortAscending: true,
    };

    this.handleTagCreated = this.handleTagCreated.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
  }

  componentDidMount() {
    document.title = "Tags | Productify";
  }

  getDurationsForTags(tags) {
    let { timerEntries } = this.props;

    timerEntries = timerEntries.filter(
      (timerEntry) => timerEntry.tag !== undefined
    );

    const groupedTimerEntries = groupObjectArrayBy(timerEntries, ["tag"]);

    const durationsByTag = tags.map((tag) => {
      return groupedTimerEntries.find(
        (timerEntriesGroup) => timerEntriesGroup[0].tag === tag.id
      )
        ? groupedTimerEntries
            .find((timerEntriesGroup) => timerEntriesGroup[0].tag === tag.id)
            .reduce(
              (acc, cur) => acc.plus(cur.duration),
              Duration.fromMillis(0)
            )
            .as("hours")
        : 0;
    });

    return durationsByTag;
  }

  getTasksDoneForTags(tags) {
    let { todos } = this.props;

    todos = todos.filter((todo) => todo.tag !== undefined);
    const groupedTodos = groupObjectArrayBy(todos, ["tag"]);
    console.log(groupedTodos);

    const doneByTag = tags.map((tag) => {
      const match =
        groupedTodos.find((todoGroup) => todoGroup[0].tag === tag.id) ?? [];

      const done = match.filter((cur) => cur.isDone);
      return [done.length, match.length];
    });

    return doneByTag;
  }

  handleSearchQuery(e) {
    this.setState({
      searchQuery: e.target.value,
    });
  }

  generateTags(tags) {
    if (!tags || tags.length === 0) return null;
    const { sortBy, sortAscending } = this.state;

    const durationsByTags = this.getDurationsForTags(tags);
    const tasksDoneByTags = this.getTasksDoneForTags(tags);

    return (
      <table>
        <tr className="flex items-center gap-4 p-2 border-b border-gray-300">
          <th className="flex-grow">
            <button
              className="flex items-center gap-2 text-center"
              name="alpha"
              onClick={this.handleSort}
            >
              <LocalOffer /> Tag Name
              {sortBy !== "alpha" ? (
                <SwapVerticalCircleOutlined />
              ) : sortAscending ? (
                <ArrowCircleDown />
              ) : (
                <ArrowCircleUp />
              )}
            </button>
          </th>
          <div className="w-[300px] flex items-center gap-4">
            <th className="w-1/3">
              <button
                className="flex items-center gap-2 text-center"
                name="duration"
                onClick={this.handleSort}
              >
                {sortBy !== "duration" ? (
                  <SwapVerticalCircleOutlined />
                ) : sortAscending ? (
                  <ArrowCircleDown />
                ) : (
                  <ArrowCircleUp />
                )}
                Duration
              </button>
            </th>
            <th className="w-1/3">
              <button
                className="flex items-center gap-2 text-center"
                name="tasksDone"
                onClick={this.handleSort}
              >
                {sortBy !== "tasksDone" ? (
                  <SwapVerticalCircleOutlined />
                ) : sortAscending ? (
                  <ArrowCircleDown />
                ) : (
                  <ArrowCircleUp />
                )}
                Tasks
              </button>
            </th>
            <th className="w-1/3">
              <button
                className="flex items-center gap-2 text-center"
                name="revenue"
                onClick={this.handleSort}
              >
                {sortBy !== "revenue" ? (
                  <SwapVerticalCircleOutlined />
                ) : sortAscending ? (
                  <ArrowCircleDown />
                ) : (
                  <ArrowCircleUp />
                )}
                Revenue
              </button>
            </th>
          </div>

          <th>
            <MoreVert className="opacity-0" />
          </th>
        </tr>

        {tags.map((tag, i) => {
          return (
            <Tag
              key={tag.id}
              tag={tag}
              duration={durationsByTags[i]}
              tasksDone={tasksDoneByTags[i]}
              revenue={0}
            />
          );
        })}
      </table>
    );
  }

  handleTagCreated(tag) {
    this.props.addTag(tag);
  }

  sortTags(tags) {
    const { sortBy, sortAscending } = this.state;

    switch (sortBy) {
      case "alpha":
        return tags.slice().sort((a, b) => {
          return sortAscending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });

      case "duration":
        const durationsByTags = this.getDurationsForTags(tags);
        return tags.slice().sort((a, b) => {
          return sortAscending
            ? durationsByTags[tags.findIndex((x) => x.name === a.name)] -
                durationsByTags[tags.findIndex((x) => x.name === b.name)]
            : durationsByTags[tags.findIndex((x) => x.name === b.name)] -
                durationsByTags[tags.findIndex((x) => x.name === a.name)];
        });

      case "tasksDone":
        const tasksDoneByTags = this.getTasksDoneForTags(tags);
        return tags.slice().sort((a, b) => {
          return sortAscending
            ? tasksDoneByTags[tags.findIndex((x) => x.name === a.name)][0] -
                tasksDoneByTags[tags.findIndex((x) => x.name === b.name)][0]
            : tasksDoneByTags[tags.findIndex((x) => x.name === b.name)][0] -
                tasksDoneByTags[tags.findIndex((x) => x.name === a.name)][0];
        });

      case "revenue":
        return tags;
    }
  }

  handleSort(e) {
    const clicked = e.target.closest("button");

    if (clicked) {
      this.setState({
        sortBy: clicked.name,
        sortAscending:
          clicked.name === this.state.sortBy ? !this.state.sortAscending : true,
      });
    }
  }

  componentDidUpdate() {
    localStorage.setItem("tags", JSON.stringify(this.props.tags));
  }

  filterTags(tags) {
    const { searchQuery } = this.state;
    if (searchQuery === "") return tags;

    return tags.filter((tag) => tag.name === searchQuery);
  }

  render() {
    const { tags } = this.props;

    const filteredTags = this.filterTags(tags);
    const sortedTags = this.sortTags(filteredTags);
    const tagsJSX = this.generateTags(sortedTags);

    return (
      <div className="w-[85%] min-h-screen flex flex-col gap-6 ml-auto p-6 text-gray-600">
        <div className="w-full h-[75px] flex justify-between items-center p-4 border border-gray-200 shadow-md">
          <h1 className="text-2xl font-bold uppercase">Tags</h1>
          <WindowHandler
            className="px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-md"
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
        <div className="flex items-center gap-2 p-2 border border-gray-300">
          <Search />
          <input
            type="text"
            className="flex-grow outline-none"
            placeholder="Search"
            onChange={this.handleSearchQuery}
          />
        </div>

        <div className="flex-grow flex flex-col">
          {tagsJSX && tagsJSX}
          {!tagsJSX && <NoData text="No Tags" />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tagReducer.tags,
    timerEntries: state.timerEntryReducer.timerEntries,
    todos: state.todoReducer.todos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTag: (tag) => {
      dispatch(tagActions.create(tag));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tags);

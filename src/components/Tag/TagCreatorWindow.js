import React from "react";
import { connect } from "react-redux";
import {
  LocalOffer,
  Done,
  ChevronRight,
  ExpandMore,
} from "@mui/icons-material";

import ModalWindow from "../UI/ModalWindow";
import { colors } from "../../helpers/colors";

class TagCreatorWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isValid: true,
      billingOptionsOpen: false,
      tag: {
        name: "",
        billableAmount: 0,
        color: colors[0],
      },
    };

    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.colorChangeHandler = this.colorChangeHandler.bind(this);
    this.handleBillableAmountChanged =
      this.handleBillableAmountChanged.bind(this);
    this.tagCreatedHandler = this.tagCreatedHandler.bind(this);
    this.toggleBillingOptions = this.toggleBillingOptions.bind(this);
  }

  componentDidMount() {
    if (this.props.tag) {
      this.setState({ tag: this.props.tag });
    }
  }

  resetState() {
    this.setState({
      isValid: true,
      billingOptionsOpen: false,
      tag: {
        name: "",
        billableAmount: 0,
        color: colors[0],
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.resetState();
    }
  }

  nameChangeHandler(e) {
    const { tags } = this.props;
    const exists = tags.some(
      (cur) => cur.name === e.target.value && cur.id !== this.state.tag.id
    );

    if (exists) {
      this.setState({
        isValid: false,
      });
    } else if (!this.state.isValid) {
      this.setState({
        isValid: true,
      });
    }

    this.setState({
      tag: {
        ...this.state.tag,
        name: e.target.value,
      },
    });
  }

  colorChangeHandler(e) {
    const clicked = e.target.closest("button");

    if (clicked) {
      this.setState({
        tag: {
          ...this.state.tag,
          color: clicked.dataset.color,
        },
      });
    }
  }

  handleBillableAmountChanged(e) {
    this.setState({
      tag: {
        ...this.state.tag,
        billableAmount: e.target.value,
      },
    });
  }

  tagCreatedHandler(e) {
    this.props.onClose();
    this.props.onTagCreated(this.state.tag);
  }

  toggleBillingOptions(e) {
    this.setState((prevState) => {
      return {
        billingOptionsOpen: !prevState.billingOptionsOpen,
      };
    });
  }

  render() {
    return (
      <ModalWindow open={this.props.open} onClose={this.props.onClose}>
        <div className="flex w-[280px] flex-col gap-4">
          <h2 className="flex w-full gap-2 border-b border-gray-300 text-2xl font-semibold uppercase text-blue-500">
            Create / Edit
          </h2>
          <div className="flex flex-col items-start gap-2">
            <label>Tag Name</label>
            <input
              type="text"
              value={this.state.tag.name}
              placeholder="e.g. Study"
              onChange={this.nameChangeHandler}
              className={`w-full border border-gray-300 p-1 focus:outline-none ${
                !this.state.isValid && "border-red-500"
              }`}
            />

            <span
              className={`self-start text-sm text-red-500 ${
                this.state.isValid ? "hidden" : "block"
              }`}
            >
              Tag Already Exists!
            </span>
          </div>
          <div className="flex flex-col items-start gap-2">
            <label>Color</label>

            <div className="grid grid-cols-8">
              {colors.map((color) => {
                return (
                  <button
                    key={color}
                    onClick={this.colorChangeHandler}
                    data-color={color}
                    className={
                      "relative flex h-[35px] w-[35px] items-center justify-center"
                    }
                    style={{ backgroundColor: `${color}` }}
                  >
                    <Done
                      className={`z-10 opacity-0 sm:border-2 sm:border-white ${
                        this.state.tag.color === color && "opacity-100"
                      } text-white`}
                      fontSize="large"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className="flex items-center justify-start gap-2"
              onClick={this.toggleBillingOptions}
            >
              {this.state.billingOptionsOpen ? (
                <ExpandMore />
              ) : (
                <ChevronRight />
              )}
              Billing Options
            </button>

            {this.state.billingOptionsOpen && (
              <div className="flex flex-col gap-2">
                <span>Enter Billable Amount (Per Hour)</span>
                <input
                  type="number"
                  value={this.state.tag.billableAmount}
                  className="border border-gray-300 p-2 outline-none"
                  onChange={this.handleBillableAmountChanged}
                />
              </div>
            )}
          </div>
          <button
            className="bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
            onClick={this.tagCreatedHandler}
            disabled={this.state.tag.name === "" || !this.state.isValid}
          >
            <LocalOffer /> Save
          </button>
        </div>
      </ModalWindow>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tagReducer.tags,
  };
};

export default connect(mapStateToProps)(TagCreatorWindow);

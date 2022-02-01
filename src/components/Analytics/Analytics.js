import React from "react";
import { connect } from "react-redux";

class Analytics extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = "Analytics | Productify";
  }

  render() {
    const { timerEntries } = this.props;

    return (
      <div className="w-[85%] min-h-screen flex flex-col ml-auto p-6 text-gray-600">
        Analytics
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timerEntries: state.timerEntryReducer.timerEntries,
  };
};

export default connect(mapStateToProps)(Analytics);

import { ArrowBack, ArrowForward, Today, Close } from "@mui/icons-material";
import { Info, DateTime, Interval } from "luxon";
import React from "react";

class PeriodChanger extends React.Component {
  constructor(props) {
    super(props);

    const { unit } = this.props;
    this.state = {
      datePickerOpen: false,
      period:
        this.props.value ??
        Interval.fromDateTimes(
          DateTime.now().startOf(unit),
          DateTime.now().endOf(unit)
        ),
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
    this.handleResetPeriod = this.handleResetPeriod.bind(this);
  }

  handlePeriodChanged(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      const { unit } = this.props;
      if (clicked.name === "minus") {
        this.setState(
          (prevState) => {
            return {
              period: prevState.period.mapEndpoints((endPoint) => {
                return endPoint.minus({
                  [unit]: 1,
                });
              }),
            };
          },
          () => {
            this.props.onChange && this.props.onChange(this.state.period);
          }
        );
      } else {
        this.setState(
          (prevState) => {
            return {
              period: prevState.period.mapEndpoints((endPoint) => {
                return endPoint.plus({
                  [unit]: 1,
                });
              }),
            };
          },
          () => {
            this.props.onChange && this.props.onChange(this.state.period);
          }
        );
      }
    }
  }

  handleResetPeriod(e) {
    this.resetState();
  }

  resetState() {
    const { unit } = this.props;
    this.setState(
      {
        period: Interval.fromDateTimes(
          DateTime.now().startOf(unit),
          DateTime.now().endOf(unit)
        ),
      },
      () => {
        this.props.onChange && this.props.onChange(this.state.period);
      }
    );
  }

  getPeriodTitle() {
    const { unit } = this.props;
    const { period } = this.state;

    switch (unit) {
      case "day":
        return period.start.toFormat("dd/MM/yyyy");

      case "week":
        return period.toFormat("dd/MM/yyyy");

      case "month":
        return `${Info.months()[period.start.month - 1]}, ${period.start.year}`;

      case "year":
        return period.start.year;
    }
  }

  render() {
    return (
      <div className="inline-flex">
        <button
          name="minus"
          onClick={this.handlePeriodChanged}
          className="px-2 rounded-l-full border border-gray-300"
        >
          <ArrowBack />
        </button>
        <span className="flex justify-between items-center gap-4 px-4 py-2 border-y border-gray-300 capitalize">
          <div className="flex items-center gap-2">
            <Today />
            {this.getPeriodTitle()}
          </div>
          <button onClick={this.handleResetPeriod}>
            <Close />
          </button>
        </span>

        <button
          name="plus"
          onClick={this.handlePeriodChanged}
          className="px-2 rounded-r-full border border-gray-300"
        >
          <ArrowForward />
        </button>
      </div>
    );
  }
}

export default PeriodChanger;

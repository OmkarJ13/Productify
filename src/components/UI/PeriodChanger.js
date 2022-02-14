// Fix bug -
// Click this week, select different date from same week.
// Change view to day
// Selected day should be today, instead of previously selected.

import React from "react";
import { ArrowBack, ArrowForward, Today, Close } from "@mui/icons-material";
import { DatePicker, PickersDay } from "@mui/lab";
import { DateTime, Interval } from "luxon";

import { getRelativeDate } from "../../helpers/getRelativeDate";
import MUIPickerHandler from "./MUIPickerHandler";

class PeriodChanger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      period: this.props.value ?? this.getPeriod(),
    };

    this.handlePeriodChanged = this.handlePeriodChanged.bind(this);
    this.handlePeriodSet = this.handlePeriodSet.bind(this);
    this.handlePeriodReset = this.handlePeriodReset.bind(this);
    this.pickersDayWeek = this.pickersDayWeek.bind(this);
  }

  getPeriod(date = DateTime.now()) {
    const { unit } = this.props;
    return Interval.fromDateTimes(date.startOf(unit), date.endOf(unit));
  }

  handlePeriodChanged(e) {
    const clicked = e.target.closest("button");
    if (clicked) {
      const { unit } = this.props;
      if (clicked.name === "minus") {
        this.setState((prevState) => {
          return {
            period: prevState.period.mapEndpoints((endPoint) => {
              return endPoint.minus({
                [unit]: 1,
              });
            }),
          };
        });
      } else {
        this.setState((prevState) => {
          return {
            period: prevState.period.mapEndpoints((endPoint) => {
              return endPoint.plus({
                [unit]: 1,
              });
            }),
          };
        });
      }
    }
  }

  handlePeriodSet(e) {
    if (this.state.period.contains(e)) return;

    this.setState({
      period: this.getPeriod(e),
    });
  }

  handlePeriodReset(e) {
    this.resetState();
  }

  resetState() {
    this.setState({
      period: this.getPeriod(),
    });
  }

  pickersDayWeek(date, selectedDates, pickersDayProps) {
    if (this.props.unit !== "week") return <PickersDay {...pickersDayProps} />;
    const dayInWeek = this.state.period.contains(date);

    return (
      <PickersDay
        {...pickersDayProps}
        className={`${dayInWeek && "Mui-selected"}`}
      />
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { unit } = this.props;
    const { period } = this.state;
    if (prevState.period.toISODate() !== period.toISODate()) {
      this.props.onChange && this.props.onChange(period);
    }
    if (prevProps.unit !== unit) {
      this.setState({
        period: this.getPeriod(period.start),
      });
    }
  }

  render() {
    const { unit } = this.props;
    const { period } = this.state;

    return (
      <div className="inline-flex">
        <button
          name="minus"
          onClick={this.handlePeriodChanged}
          className="rounded-l-full border border-gray-300 px-2"
        >
          <ArrowBack />
        </button>
        <span className="flex items-center justify-between gap-4 border-y border-gray-300 px-4 py-2 capitalize">
          <MUIPickerHandler
            renderPicker={(otherProps) => {
              return (
                <DatePicker
                  {...otherProps}
                  value={period.start}
                  onChange={this.handlePeriodSet}
                  showToolbar={false}
                  views={
                    unit === "month"
                      ? ["month", "year"]
                      : unit === "year"
                      ? ["year"]
                      : ["day"]
                  }
                  renderInput={({ inputRef, InputProps }) => {
                    return (
                      <button
                        ref={inputRef}
                        onClick={InputProps.onClick}
                        className="flex items-center gap-2 capitalize"
                      >
                        <Today />
                        {getRelativeDate(
                          this.state.period.start,
                          this.props.unit
                        )}
                      </button>
                    );
                  }}
                  renderDay={this.pickersDayWeek}
                />
              );
            }}
          />
          <button
            onClick={this.handlePeriodReset}
            disabled={period.toISODate() === this.getPeriod().toISODate()}
            className="disabled:text-gray-300"
          >
            <Close />
          </button>
        </span>

        <button
          name="plus"
          onClick={this.handlePeriodChanged}
          className="rounded-r-full border border-gray-300 px-2"
        >
          <ArrowForward />
        </button>
      </div>
    );
  }
}

export default PeriodChanger;

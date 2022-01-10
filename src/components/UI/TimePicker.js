import React from "react";

class TimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hour: "00",
      minute: "00",
    };

    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      const [hour, minute] = value.split(":");
      if (!hour || !minute) {
        console.error("Value should be a string with a format of 'hh:mm'");
        return;
      }

      this.setState({
        hour,
        minute,
      });
    }
  }

  handleHourChange(e) {
    const hour = Number(e.target.value);

    if (hour < 0) {
      e.target.value = 0;
    } else if (hour > 23) {
      e.target.value = 23;
    }

    this.setState(
      {
        hour: e.target.value,
      },
      () => {
        const { hour, minute } = this.state;

        const hourNum = Number(hour);
        const minuteNum = Number(minute);

        const hourString = hourNum.toString().padStart(2, "0");
        const minuteString = minuteNum.toString().padStart(2, "0");

        const timeString = `${hourString}:${minuteString}`;

        if (this.props.onChange) {
          this.props.onChange(timeString);
        }
      }
    );
  }

  handleMinuteChange(e) {
    const minute = Number(e.target.value);

    if (minute < 0) {
      e.target.value = 0;
    } else if (minute > 59) {
      e.target.value = 59;
    }

    this.setState(
      {
        minute: e.target.value,
      },
      () => {
        const { hour, minute } = this.state;

        const hourNum = Number(hour);
        const minuteNum = Number(minute);

        const hourString = hourNum.toString().padStart(2, "0");
        const minuteString = minuteNum.toString().padStart(2, "0");

        const timeString = `${hourString}:${minuteString}`;

        if (this.props.onChange) {
          this.props.onChange(timeString);
        }
      }
    );
  }

  handleBlur(e) {
    const { hour, minute } = this.state;

    const hourString = Number(hour).toString().padStart(2, "0");
    const minuteString = Number(minute).toString().padStart(2, "0");

    this.setState({
      hour: hourString,
      minute: minuteString,
    });
  }

  render() {
    const { hour, minute } = this.state;

    return (
      <form
        className={
          this.props.className ??
          "p-1 flex justify-center items-center gap-1 border border-gray-300"
        }
        onBlur={this.handleBlur}
      >
        <input
          type="number"
          min="0"
          max="23"
          value={hour}
          onChange={this.handleHourChange}
          className="w-[20px] text-center focus:outline-none text-base"
          required
        />
        <span>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={minute}
          onChange={this.handleMinuteChange}
          className="w-[20px] text-center focus:outline-none text-base"
          required
        />
      </form>
    );
  }
}

export default TimePicker;

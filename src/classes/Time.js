import {
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from "../constants/timeHelper";

class Time {
  constructor(hours, minutes, seconds) {
    if (hours !== undefined || minutes !== undefined || seconds !== undefined) {
      this.hours = hours ? hours : 0;
      this.minutes = minutes ? minutes : 0;
      this.seconds = seconds ? seconds : 0;
    } else {
      const currentDate = new Date();
      this.hours = currentDate.getHours();
      this.minutes = currentDate.getMinutes();
      this.seconds = currentDate.getSeconds();
    }
  }

  static fromSeconds(seconds) {
    const hours = Math.floor(seconds / SECONDS_IN_HOUR);
    const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);

    return new Time(hours, minutes, seconds % SECONDS_IN_MINUTE);
  }

  static getMin(...timeArr) {
    let min = timeArr[0];
    timeArr.forEach((time) => {
      if (time.hours < min.hours) {
        min = time;
      } else if (time.hours === min.hours) {
        if (time.minutes < min.minutes) {
          min = time;
        } else if (time.minutes === min.minutes) {
          if (time.seconds < min.seconds) {
            min = time;
          }
        }
      }
    });

    return min;
  }

  static getMax(...timeArr) {
    let max = timeArr[0];
    timeArr.forEach((time) => {
      if (time.hours > max.hours) {
        max = time;
      } else if (time.hours === max.hours) {
        if (time.minutes > max.minutes) {
          max = time;
        } else if (time.minutes === max.minutes) {
          if (time.seconds > max.seconds) {
            max = time;
          }
        }
      }
    });

    return max;
  }

  static addTime(...timeArr) {
    return timeArr.reduce((acc, cur) => {
      let seconds = cur.seconds + acc.seconds;
      let minutes = cur.minutes + acc.minutes;
      let hours = cur.hours + acc.hours;

      if (seconds >= SECONDS_IN_MINUTE) {
        minutes++;
        seconds = seconds % SECONDS_IN_MINUTE;
      }

      if (minutes >= MINUTES_IN_HOUR) {
        hours++;
        minutes = minutes % MINUTES_IN_HOUR;
      }

      acc = new Time(hours, minutes, seconds);
      return acc;
    }, new Time(0, 0, 0));
  }

  addTime(time) {
    let seconds = this.seconds + time.seconds;
    let minutes = this.minutes + time.minutes;
    let hours = this.hours + time.hours;

    if (seconds > SECONDS_IN_MINUTE) {
      minutes++;
      seconds = seconds % SECONDS_IN_MINUTE;
    }

    if (minutes > MINUTES_IN_HOUR) {
      hours++;
      minutes = minutes % MINUTES_IN_HOUR;
    }

    const result = new Time(hours, minutes, seconds);
    return result;
  }

  subtractTime(time) {
    let seconds = this.seconds - time.seconds;
    let minutes = this.minutes - time.minutes;
    let hours = this.hours - time.hours;

    if (seconds < 0) {
      minutes--;
      seconds = seconds + SECONDS_IN_MINUTE;
    }

    if (minutes < 0) {
      hours--;
      minutes = minutes + MINUTES_IN_HOUR;
    }

    if (hours < 0) {
      hours = hours + HOURS_IN_DAY;
    }

    const result = new Time(hours, minutes, seconds);
    return result;
  }

  toSeconds() {
    return (
      this.hours * SECONDS_IN_HOUR +
      this.minutes * SECONDS_IN_MINUTE +
      this.seconds
    );
  }

  toHours(precision = 2) {
    const minutes = this.minutes / MINUTES_IN_HOUR;
    return (this.hours + minutes).toPrecision(precision);
  }

  toTimeString() {
    return `${this.toHourString()}:${this.toMinuteString()}:${this.toSecondString()}`;
  }

  toTimeStringShort() {
    return `${this.toHourString()}:${this.toMinuteString()}`;
  }

  toHourString() {
    return this.hours.toString().padStart(2, "0");
  }

  toMinuteString() {
    return this.minutes.toString().padStart(2, "0");
  }

  toSecondString() {
    return this.seconds.toString().padStart(2, "0");
  }
}

export default Time;

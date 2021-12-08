class Time {
  constructor(hours = 0, minutes = 0, seconds = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  static fromSeconds(inputSeconds) {
    const secondsInHour = 3600;
    const secondsInMinute = 60;

    const hours = Math.floor(inputSeconds / secondsInHour);
    const minutes = Math.floor(
      (inputSeconds % secondsInHour) / secondsInMinute
    );
    const seconds = inputSeconds % secondsInMinute;

    return new Time(hours, minutes, seconds);
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

      if (seconds >= 60) {
        minutes++;
        seconds = seconds % 60;
      }

      if (minutes >= 60) {
        hours++;
        minutes = minutes % 60;
      }

      acc = new Time(hours, minutes, seconds);
      return acc;
    }, new Time());
  }

  static getCurrentTime() {
    const curDate = new Date();
    return new Time(
      curDate.getHours(),
      curDate.getMinutes(),
      curDate.getSeconds()
    );
  }

  subtractTime(time) {
    let seconds = this.seconds - time.seconds;
    let minutes = this.minutes - time.minutes;
    let hours = this.hours - time.hours;

    if (seconds < 0) {
      minutes--;
      seconds = seconds + 60;
    }

    if (minutes < 0) {
      hours--;
      minutes = minutes + 60;
    }

    if (hours < 0) {
      hours = hours + 24;
    }

    const result = new Time(hours, minutes, seconds);
    return result;
  }

  getTimeString() {
    return `${this.getHourString()}:${this.getMinuteString()}:${this.getSecondString()}`;
  }

  getTimeStringShort() {
    return `${this.getHourString()}:${this.getMinuteString()}`;
  }

  getHourString() {
    return this.hours.toString().padStart(2, "0");
  }

  getMinuteString() {
    return this.minutes.toString().padStart(2, "0");
  }

  getSecondString() {
    return this.seconds.toString().padStart(2, "0");
  }
}

export default Time;

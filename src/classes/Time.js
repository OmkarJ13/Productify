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

  addTime(time) {
    let seconds = this.seconds + time.seconds;
    let minutes = this.minutes + time.minutes;
    let hours = this.hours + time.hours;

    if (seconds >= 60) {
      minutes++;
      seconds = seconds % 60;
    }

    if (minutes >= 60) {
      hours++;
      minutes = minutes % 60;
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
      seconds = seconds % 60;
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
    const hourString = this.hours.toString().padStart(2, "0");
    const minuteString = this.minutes.toString().padStart(2, "0");
    const secondString = this.seconds.toString().padStart(2, "0");

    return `${hourString}:${minuteString}:${secondString}`;
  }

  getHourString() {
    return this.getTimeString().split(":")[0];
  }

  getMinuteString() {
    return this.getTimeString().split(":")[1];
  }

  getSecondString() {
    return this.getTimeString().split(":")[2];
  }
}

export default Time;

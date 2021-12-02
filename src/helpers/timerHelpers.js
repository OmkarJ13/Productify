const startInterval = (callback, interval) => {
  callback();
  return setInterval(callback, interval);
};

export { startInterval };

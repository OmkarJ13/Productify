export const mod = (a, b) => {
  if (a >= 0 && b >= 0) {
    return a % b;
  } else {
    return (a % b) + b;
  }
};

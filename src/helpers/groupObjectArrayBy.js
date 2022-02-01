export const groupObjectArrayBy = (array, keys) => {
  const groupedArray = [];

  array.forEach((cur, _, self) => {
    const matches = self.filter((ele) => {
      return keys.every((key) => {
        if (typeof cur[key] === "object") {
          return JSON.stringify(cur[key]) === JSON.stringify(ele[key]);
        }
        return cur[key] === ele[key];
      });
    });

    const includes = groupedArray.some(
      (ele) => JSON.stringify(ele) === JSON.stringify(matches)
    );

    if (!includes) groupedArray.push(matches);
  });

  return groupedArray;
};

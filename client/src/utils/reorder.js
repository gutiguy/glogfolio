const swapArrayElements = (arr, x, y) => {
  if (arr[x] === undefined || arr[y] === undefined) {
    return arr;
  }
  const a = x > y ? y : x;
  const b = x > y ? x : y;
  return [
    ...arr.slice(0, a),
    arr[b],
    ...arr.slice(a + 1, b),
    arr[a],
    ...arr.slice(b + 1)
  ];
};

function getAfterId({ oldIndex, newIndex, arr }) {
  let afterId = false;

  if (oldIndex > newIndex) {
    afterId = arr[newIndex - 1].id;
  } else {
    afterId = arr[newIndex].id;
  }

  return afterId;
}

export { swapArrayElements, getAfterId };

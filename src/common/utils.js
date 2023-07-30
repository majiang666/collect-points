export const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const isArray = (o) => {
  return Object.prototype.toString.call(o) === "[object Array]";
};

export const getArrayRandom = (arr = [], num = 0) => {
  if (!isArray(arr)) {
    return arr;
  }
  let delNum,
    delArr,
    res = [];
  if (num >= arr.length) {
    res = arr.splice(0, arr.length);
  } else {
    for (let i = 0; i < num; i++) {
      delNum = Math.floor(Math.random() * arr.length);
      delArr = arr.splice(delNum, 1);
      res = res.concat(delArr);
    }
  }
  return res;
};

export function throttle (fn, threshold = 250, scope) {
  let disabled = false;
  return async function () {
    const context = scope || this;
    const args = arguments;
    if (disabled) {
      return;
    }

    disabled = true;
    setTimeout(() => {
      disabled = false;
    }, threshold);
    await fn.apply(context, args);
  };
};

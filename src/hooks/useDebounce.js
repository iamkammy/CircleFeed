import { useRef } from "react";

export const useDebounce = (fn, delay) => {
  let timer = useRef(null);

  return function (...args) {
    let context = this;
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

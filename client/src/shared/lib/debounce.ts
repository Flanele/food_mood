export const debounce = (fn: (value: string) => void, delay = 300) => {
  let timeoutId: number | undefined;

  return (value: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      fn(value);
    }, delay);
  };
};


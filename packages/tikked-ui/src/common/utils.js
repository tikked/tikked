export function delay(duration) {
  return function (...args) {
    return new Promise((resolve) =>
      setTimeout(function () {
        resolve(...args);
      }, duration)
    );
  };
}

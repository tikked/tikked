export const objectMap = <T, U extends T[keyof T], V>(object: T, mapFn: (elem: U) => V) =>
  Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key]);
    return result;
  }, {});

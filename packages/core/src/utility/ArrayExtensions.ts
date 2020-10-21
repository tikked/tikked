interface Array<T> {
  duplicates(): T[];
  unique(): T[];
  max(extractor: (elem: T) => number): T;
}

Array.prototype.duplicates = function() {
  return this.filter((elem, i) => this.indexOf(elem) !== i).unique();
};

Array.prototype.unique = function() {
  return Array.from(new Set(this));
};

Array.prototype.max = function<T>(extractor: (elem: T) => number) {
  if (this.length === 0) {
    throw new Error('Unable to get max value of empty array');
  }
  return this.reduce((acc, cur) => (extractor(cur) > extractor(acc) ? cur : acc), this[0]);
};

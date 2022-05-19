import { Identifiable } from '../domain/Identifiable';

export const validateIsNotEmpty = <T>(
  val?: string | null | T[],
  msg = 'Value should be non-empty'
) => {
  if (!val) {
    throw new Error(msg);
  }
  if (val instanceof Array && val.length === 0) {
    throw new Error(msg);
  }
};

export const validateUniqueIds = (elems: readonly Identifiable[]) => {
  const duplicates = elems.map((ff) => ff.Id).duplicates();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate ids detected: ${duplicates}`);
  }
};

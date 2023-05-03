export const to = <T, U = Error>(promise: Promise<T>) => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => [err, undefined]);
};

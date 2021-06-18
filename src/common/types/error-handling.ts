interface CustomError extends Error {
  isNotFound?: boolean;
}

export type { CustomError };

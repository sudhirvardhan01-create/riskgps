let errorHandler: ((msg: string) => void) | null = null;

export const registerGlobalErrorHandler = (fn: (msg: string) => void) => {
  errorHandler = fn;
};

export const showGlobalError = (msg: string) => {
  if (errorHandler) errorHandler(msg);
  else console.error("Global toast handler not registered:", msg);
};

import axios, { AxiosError } from 'axios';

type ErrorResponseHandlerArg<T, U = any> = (
  param: T,
  fallbackErrorMessage: string,
  reporter?: () => void
) => U | T;

type ExtractedError = {
  message: string;
  description: string;
};

export const handleResponseError: ErrorResponseHandlerArg<
  Error | AxiosError<any>,
  ExtractedError
> = (err, fallbackErrorMessage = 'Something went wrong', reporter) => {
  reporter && reporter();
  const message = err?.message;
  let description = '';
  if (axios.isAxiosError(err)) {
    if (err?.response) {
      description = Array.isArray(err?.response?.data)
        ? err?.response?.data?.join(',')
        : err?.response?.data?.toString() || '';
    }
  }

  return { message, description };
};

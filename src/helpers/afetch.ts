import { ApiResponse } from '../api/API';

export async function afetch<T>(
  promise: Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  return promise.catch((error) => ({
    status: 'error',
    message: error.message,
    data: null,
  }));
}

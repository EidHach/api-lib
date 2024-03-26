import { ApiResponse } from '../api/API'
import { ApiError } from '../api/ApiError'

export async function afetch<T>(
  promise: Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  try {
    const response = await promise
    if (response.status === 'success') {
      // Successful response
      return response
    } else {
      // Error response
      throw new ApiError(response.status, response.message, response.data)
    }
  } catch (error) {
    // Handle unexpected errors during the promise execution
    const status = error instanceof ApiError ? error.status : 500
    const message =
      error instanceof ApiError ? error.message : 'An unknown error occurred'
    return {
      status,
      message,
      data: null,
    }
  }
}


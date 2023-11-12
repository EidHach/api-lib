import { ApiResponse } from './API';

export class ApiSuccess<T> {
  static defaultMessage = 'Operation completed successfully';

  constructor(private message: string = ApiSuccess.defaultMessage) {}

  createResponse(data: T | null): ApiResponse<T> {
    return {
      status: 'success',
      message: this.message,
      data,
    };
  }
}

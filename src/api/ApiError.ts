import { ApiResponse } from './API';

export class ApiError extends Error {
  status: number | string;
  data: any;

  constructor(status: number | string, message: string, data: any = null) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    this.data = data;
  }

  toResponse(): ApiResponse<any> {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}

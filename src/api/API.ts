import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from './ApiError';
import { ApiSuccess } from './ApiSuccess';

export interface ApiResponse<T> {
  status: number | 'success' | 'error';
  message: string;
  data: T | null;
}

export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
  authToken?: string;
  resourcePath?: string;
}

export class API {
  protected static axiosInstance: AxiosInstance;
  protected static resourcePath: string = '';
  protected static authToken?: string;

  public static initialize(config: ApiConfig): void {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
    });

    this.authToken = config.authToken;
    this.resourcePath = config.resourcePath || '';

    // Set up an interceptor to inject the Auth token on each request
    this.axiosInstance.interceptors.request.use((axiosConfig) => {
      if (this.authToken) {
        axiosConfig.headers['Authorization'] = `Bearer ${this.authToken}`;
      }
      return axiosConfig;
    });
  }

  public static updateAuthToken(authToken: string | undefined): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = authToken
      ? `Bearer ${authToken}`
      : '';
  }

  protected static concatUrl(url: string): string {
    return this.resourcePath ? `${this.resourcePath}/${url}` : url;
  }

  protected static async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const fullPath = this.concatUrl(url);
      const response: AxiosResponse<T> = await this.axiosInstance[method]<T>(
        fullPath,
        method === 'get' ? { params } : data,
        method === 'get' ? undefined : { params }
      );
      return new ApiSuccess<T>('Request successful').createResponse(
        response.data
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        throw new ApiError(status, message, error.response?.data);
      }
      throw new ApiError(500, 'An unknown error occurred');
    }
  }

  public static async get<T>(
    url: string,
    params?: object
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('get', url, undefined, params);
  }

  public static async post<T>(
    url: string,
    data?: object,
    params?: object
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('post', url, data, params);
  }

  public static async put<T>(
    url: string,
    data?: object,
    params?: object
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('put', url, data, params);
  }

  public static async delete<T>(
    url: string,
    params?: object
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<null>('delete', url, undefined, params);
  }

  public static async downloadFile(
    url: string,
    params?: object
  ): Promise<ApiResponse<Blob>> {
    const fullPath = this.concatUrl(url);
    const response = await this.axiosInstance.get<Blob>(fullPath, {
      params,
      responseType: 'blob',
    });
    return new ApiSuccess<Blob>('File downloaded successfully').createResponse(
      response.data
    );
  }

  public static async uploadFile(
    url: string,
    file: File,
    params?: object
  ): Promise<ApiResponse<string>> {
    const fullPath = this.concatUrl(url);
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.axiosInstance.post<string>(fullPath, formData, {
      params,
    });
    return new ApiSuccess<string>('File uploaded successfully').createResponse(
      response.data
    );
  }

  public static async uploadImage(
    url: string,
    image: File,
    params?: object
  ): Promise<ApiResponse<string>> {
    const fullPath = this.concatUrl(url);
    const formData = new FormData();
    formData.append('image', image);
    const response = await this.axiosInstance.post<string>(fullPath, formData, {
      params,
    });
    return new ApiSuccess<string>('Image uploaded successfully').createResponse(
      response.data
    );
  }
}

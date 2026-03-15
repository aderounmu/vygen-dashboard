export interface ApiSuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  code: number;
  request_id: string;
  error: string;
}

export interface ApiHookEffect<TData = any, TVariables = any, TError = any> {
  successFn?: (data: TData, variables: TVariables, context?: any) => void | null;
  failureFn?: (error: TError, variables: TVariables, context?: any) => void | null;
}

export interface BaseTimestamps {
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}
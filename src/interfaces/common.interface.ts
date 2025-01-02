export interface IPaginationParams {
  page: number
  limit: number
  keyword?: string
}
export interface IErrorResponse {
  errorCode: string
  message: string
  status: number
}

export interface IDataResponse {
  statusCode: string
  message: string
}

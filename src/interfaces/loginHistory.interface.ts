export interface ILoginHistoryData {
  address: string
  lat: number
  lon: number
}

export interface ILoginHistoryResponse {
  id: string
  deviceId: string
  ipAddress: string
  userAgent: string
  address: string
  lat: number
  lon: number
  loginTime: string
}

export interface IQueryLoginHistory {
  startDate: string
  endDate: string
  skip: number
}

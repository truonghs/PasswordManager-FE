import { Status2FA, StatusEnable2FA } from '@/utils/constants'

export interface IRegisterPayload {
  message: string
}
export interface ICurrentUser {
  id: string
  name: string
  role: string
  email: string
  avatar?: string
  phoneNumber?: string
  status?: Status2FA
  highLevelPasswords: {
    type: string
    status: string
  }[]
  subscriptionDetail: {
    id: string
    name: string
    maxAccounts: number
    maxWorkspaces: number
    weights: number
  }
  subscription: string
  isSkippedTwoFa?: boolean
}
export interface ILoginPayload {
  message: string
  currentUser: ICurrentUser
}

export interface IErrorPayload {
  message: string
  errorCode: string
}

export interface IRegisterData {
  name: string
  email: string
  password: string
}

export interface ILoginData {
  email: string
  password: string
}

export interface IVerifyOTP {
  email: string
  otp: string
}
export interface IVerifyTokenTwoFa {
  userId: string
  token: string
}
export interface IResetPasswordData {
  email: string
  password: string
}

export interface ILoginResultWith2FA {
  userId: string
  statusEnableTwoFa: StatusEnable2FA
}

export interface ILoginResultWithTokens {
  accessToken: string
  refreshToken: string
  currentUser: ICurrentUser
}

export type ILoginResponse = ILoginResultWith2FA | ILoginResultWithTokens

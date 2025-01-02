import { instance as axiosClient } from '@/config'
import {
  IChangePassWordData,
  IDataResponse,
  ILoginData,
  ILoginResponse,
  ILoginResultWithTokens,
  IRegisterData,
  IResetPasswordData,
  IVerifyOTP,
  IVerifyTokenTwoFa
} from '@/interfaces'

export const authApi = {
  register: async (userData: IRegisterData) => {
    const { data } = await axiosClient.post<IDataResponse>('/auth/register', userData)
    return data
  },

  login: async (userData: ILoginData) => {
    const { data } = await axiosClient.post<ILoginResponse>('/auth/login', userData)
    return data
  },

  confirmEmail: async (id: string) => {
    const { data } = await axiosClient.post<IDataResponse>('auth/confirm', { id })
    return data
  },

  logout: async () => {
    const { data } = await axiosClient.post('/auth/logout')
    return data
  },

  forgotPassword: async (email: string) => {
    const { data } = await axiosClient.post<IDataResponse>('/auth/forgot-password', {
      email
    })
    return data
  },

  verifyOtp: async (verifyOtpData: IVerifyOTP) => {
    const { data } = await axiosClient.post<IDataResponse>('/auth/verify-otp', verifyOtpData)
    return data
  },

  resetPassword: async (resetPasswordData: IResetPasswordData) => {
    const { data } = await axiosClient.post<IDataResponse>('/auth/reset-password', resetPasswordData)
    return data
  },

  changePassword: async (changePassWordData: IChangePassWordData) => {
    const { data } = await axiosClient.patch<IDataResponse>('auth/change-password', changePassWordData)
    return data
  },

  getQrCodeValue: async () => {
    const { data } = await axiosClient.get<{ qrCodeUrl: string }>('/auth/generate-qr')
    return data.qrCodeUrl
  },

  verifyTokenTwoFa: async (verifyTokenTwoFaData: IVerifyTokenTwoFa) => {
    const { data } = await axiosClient.post<ILoginResultWithTokens>('/auth/verify-token-2fa', verifyTokenTwoFaData)
    return data
  },

  getToken: async (userId: string) => {
    const { data } = await axiosClient.get<ILoginResponse>(`/auth/get-token/${userId}`)
    return data
  }
}

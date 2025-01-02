import * as yup from 'yup'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Form, Result, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { authApi } from '@/apis'
import { useBoolean } from '@/hooks'
import { icons } from '@/utils/icons'
import { CustomBtn, CustomInput } from '@/components'
import { LOCAL_STORAGE_KEYS, PATH } from '@/utils/constants'
import authBg from '@/assets/images/forgot-password-bg.png'
import { IDataResponse, IErrorResponse, IResetPasswordData } from '@/interfaces'

import { VerifyOtp } from './VerifyOtp'
import { Newpassword } from './NewPassword'

type ResetPasswordData = {
  password: string
  confirmPassword: string
}

type VerifyOtpData = {
  email: string
  otp: string
}

const emailSchema = yup.object().shape({
  email: yup.string().email('Please input a valid email!').required('Please input your email!')
})

export function ForgotPassword() {
  const navigate = useNavigate()

  const { value: showOtp, setTrue: setShowOtp } = useBoolean(false)

  const { value: showResult, setTrue: setShowResult } = useBoolean(false)

  const { value: showNewPasswordForm, setTrue: setShowNewPasswordForm } = useBoolean(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(emailSchema)
  })

  const handleForgotPassword = async (data: { email: string }) => {
    mutateForgotPassword(data.email)
    localStorage.setItem(LOCAL_STORAGE_KEYS.currentEmail, data.email)
  }

  const {
    mutate: mutateForgotPassword,
    isPending: isPendingForgotPassowrd,
    error: errorForgotPassowrd,
    isError: isErrorForgotPassowrd
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setShowOtp()
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Forgot password failed: ' + errorMessage)
    }
  })

  const handleVerifyOtp = async (otp: string) => {
    const payload = { email: localStorage.getItem(LOCAL_STORAGE_KEYS.currentEmail) || '', otp }
    if (!payload.email) {
      message.error('Not found email')
      return
    }
    mutateVerifyOtp(payload)
  }

  const {
    mutate: mutateVerifyOtp,
    isPending: isPendingVerifyOtp,
    error: errorVerifyOtp
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, VerifyOtpData>({
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      setShowNewPasswordForm()
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Verify OTP failed' + errorMessage)
    }
  })

  const handleResetPassword = async (data: ResetPasswordData) => {
    const payload = {
      email: localStorage.getItem(LOCAL_STORAGE_KEYS.currentEmail) || '',
      password: String(data.password)
    }
    if (!payload.email) {
      message.error('Not found email')
      return
    }
    mutateResetPassword(payload)
  }

  const {
    mutate: mutateResetPassword,
    isPending: isPendingResetPassword,
    error: errorResetPassword
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, IResetPasswordData>({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      setShowResult()
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Reset password failed' + errorMessage)
    }
  })

  const onBack = () => {
    navigate(PATH.HOME)
  }

  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full mx-auto flex xs:flex-col xs:px-4 lg:flex-row lg:items-center items-end bg-white shadow-lg rounded-lg overflow-hidden h-full'>
        <div className='hidden lg:block w-[60%] xl:h-full'>
          <img src={authBg} alt='Auth Background' className='object-cover h-full w-full' />
        </div>
        <button
          className='lg:hidden hover:bg-gray-100 cursor-pointer xs:block w-fit p-2 rounded-md m-4'
          onClick={onBack}
        >
          <span className='text-3xl text-gray-700 font-semibold float-right'>{icons.close}</span>
        </button>
        <div className='flex flex-1 bg-white xs:w-full xs:mb-64 lg:mb-0'>
          <div
            className={`m-auto ${showOtp && showResult && !showNewPasswordForm ? 'w-full' : 'lg:w-[80%] xs:w-full'}`}
          >
            {!showOtp && !showNewPasswordForm && (
              <div>
                <h1 className='text-3xl font-semibold mb-4'>Forgot password</h1>
                {isErrorForgotPassowrd && (
                  <span className='inline-block text-red-500 mb-2 text-lg'>
                    {errorForgotPassowrd.response?.data.message}
                  </span>
                )}
                <Form onFinish={handleSubmit(handleForgotPassword)} layout='vertical'>
                  <CustomInput
                    name='email'
                    label='Email'
                    size='large'
                    control={control}
                    errors={errors}
                    placeholder='Enter your email'
                  />
                  <CustomBtn
                    title='Submit'
                    type='primary'
                    htmlType='submit'
                    className='mt-4'
                    disabled={isPendingForgotPassowrd}
                    loading={isPendingForgotPassowrd}
                  />
                </Form>
              </div>
            )}

            {showOtp && !showNewPasswordForm && (
              <VerifyOtp
                loading={isPendingVerifyOtp}
                onVerifyOtp={handleVerifyOtp}
                errorMessage={errorVerifyOtp?.response?.data.message}
              />
            )}
            {showNewPasswordForm && !showResult && (
              <Newpassword
                loading={isPendingResetPassword}
                handleResetPassword={handleResetPassword}
                errorMessage={errorResetPassword?.response?.data.message}
              />
            )}
            {showResult && (
              <Result
                className='flex-1 p-0 animate-fadeIn'
                status='success'
                title='Reset password successfully. Please login again!!'
                extra={[
                  <Link
                    to={PATH.LOGIN}
                    className='bg-[#52c41a] px-4 py-3 font-bold rounded-md text-white hover:text-white hover:opacity-80'
                  >
                    Login
                  </Link>
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

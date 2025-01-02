import * as yup from 'yup'
import { AxiosError } from 'axios'
import { Form, message } from 'antd'
import { useForm } from 'react-hook-form'
import ReCAPTCHA from 'react-google-recaptcha'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { authApi } from '@/apis'
import { userKeys } from '@/keys'
import { icons } from '@/utils/icons'
import { VerifyTokenTwoFa } from '@/pages'
import { useAuth, useBoolean } from '@/hooks'
import authBg from '@/assets/images/auth-bg.png'
import { CustomBtn, CustomInput } from '@/components'
import { AUTH_FIELDS, ENVIRONMENT_KEYS, LOCAL_STORAGE_KEYS, PATH } from '@/utils/constants'
import { IErrorResponse, ILoginData, ILoginResponse, ILoginResultWith2FA } from '@/interfaces'

const schema = yup.object().shape({
  email: yup.string().email('Please input a valid Email!').required('Please input your email!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!')
})

export function Login() {
  const navigate = useNavigate()

  const currentPath = window.location.pathname

  const queryClient = useQueryClient()

  const { currentUser } = useAuth()

  const [userTwoFaId, setUserTwoFaId] = useState<string>('')

  const {
    value: isCaptcharVerified,
    setTrue: setIsCaptcharVerified,
    setFalse: setIsNotCaptcharVerified
  } = useBoolean(false)

  const { value: visibleVerifyTokenTwoFaForm, setTrue: setVerifyTokenTwoFaForm } = useBoolean(false)

  const captchaRef = useRef<ReCAPTCHA | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleLogin = async (data: ILoginData) => {
    mutateLogin(data)
  }

  const isLoginResultWith2FA = (response: ILoginResponse): response is ILoginResultWith2FA => {
    return (response as ILoginResultWith2FA).statusEnableTwoFa !== undefined
  }

  const {
    mutate: mutateLogin,
    isPending,
    error,
    isError
  } = useMutation<ILoginResponse, AxiosError<IErrorResponse>, ILoginData>({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (isLoginResultWith2FA(response)) {
        setUserTwoFaId(response.userId)
        setVerifyTokenTwoFaForm()
      } else {
        navigate(PATH.VAULT, { state: { fromLogin: true } })
        message.success('Login successfully!')
        localStorage.setItem(LOCAL_STORAGE_KEYS.isLoggedIn, 'true')
        queryClient.invalidateQueries(userKeys.profile())
      }
    },
    onError: () => {
      captchaRef.current?.reset()
      setIsNotCaptcharVerified()
    }
  })

  const onBack = () => {
    navigate(PATH.HOME)
  }

  const verifyTokenTwoFaSuccess = () => {
    navigate(PATH.HOME, { state: { fromLogin: true } })
    localStorage.setItem(LOCAL_STORAGE_KEYS.isLoggedIn, 'true')
  }

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate(PATH.ADMIN)
      else navigate('/')
    }
  }, [currentUser, navigate])

  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='w-full mx-auto flex xs:flex-col lg:flex-row lg:items-center items-end bg-white shadow-lg rounded-lg overflow-hidden h-full'>
        <div className='hidden lg:block w-[60%] h-full'>
          <img src={authBg} alt='Auth Background' className='object-cover h-full w-full' />
        </div>
        <button
          className='lg:hidden hover:bg-gray-100 cursor-pointer xs:block w-fit p-2 rounded-md m-4'
          onClick={onBack}
        >
          <span className='text-3xl text-gray-700 font-semibold float-right'>{icons.close}</span>
        </button>
        <div className='flex flex-1 bg-white xs:w-full'>
          {visibleVerifyTokenTwoFaForm ? (
            <VerifyTokenTwoFa userTwoFaId={userTwoFaId} onVerifySuccess={verifyTokenTwoFaSuccess} />
          ) : (
            <div className='m-auto w-[80%]'>
              <h1 className='text-3xl font-semibold mb-4'>Sign in</h1>
              {isError && (
                <span className='inline-block text-red-500 mb-2 text-lg'>{error?.response?.data.message}</span>
              )}
              {!currentPath.includes('admin') && (
                <div>
                  <span className='text-lg'>If you don't have an account.</span> <br />
                  <span className='text-lg inline-block mr-2'>You can</span>
                  <Link to='/register' className='text-lg text-blue-500 font-semibold hover:underline'>
                    Register here!
                  </Link>
                </div>
              )}
              <Form className='mt-6' onFinish={handleSubmit(handleLogin)} layout='vertical'>
                {AUTH_FIELDS.map((field) => {
                  if (field.name === 'email' || field.name === 'password')
                    return (
                      <CustomInput
                        key={field.name}
                        name={field.name}
                        size='large'
                        type={field.type}
                        label={field.label}
                        control={control}
                        errors={errors}
                        placeholder={field.placeholder}
                      />
                    )
                })}
                <button className='w-fit float-right text-right text-base font-normal text-red-500 hover:underline'>
                  <Link to={PATH.FORGOT_PASSWORD} className='hover:text-red-500'>
                    Forgot password?
                  </Link>
                </button>
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={ENVIRONMENT_KEYS.VITE_CAPTCHAR_SITE_KEY}
                  onChange={(token) => {
                    if (token) {
                      setIsCaptcharVerified()
                    } else {
                      setIsNotCaptcharVerified()
                    }
                  }}
                  onExpired={setIsNotCaptcharVerified}
                  className='mt-6'
                />
                <CustomBtn
                  title='Login'
                  type='primary'
                  htmlType='submit'
                  className='mt-4'
                  disabled={isPending || !isCaptcharVerified}
                  loading={isPending}
                  onClick={handleSubmit(handleLogin)}
                />
              </Form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

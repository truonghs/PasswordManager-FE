import * as yup from 'yup'
import { AxiosError } from 'axios'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Result, message, Form } from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import { authApi } from '@/apis'
import { icons } from '@/utils/icons'
import { useAuth, useBoolean } from '@/hooks'
import authBg from '@/assets/images/auth-bg.png'
import { CustomBtn, CustomInput } from '@/components'
import { AUTH_FIELDS, ENVIRONMENT_KEYS, PATH } from '@/utils/constants'
import { IDataResponse, IErrorResponse, IRegisterData } from '@/interfaces'

const schema = yup.object().shape({
  name: yup.string().required('Please input your name!'),
  email: yup.string().email('Please input a valid email!').required('Please input your email!'),
  password: yup.string().min(8, 'Password needs to be at least 8 characters.').required('Please input your password!'),
  confirmPassword: yup
    .string()
    .required('Please input your password!')
    .oneOf([yup.ref('password')], 'passwords must match')
})

export function Register() {
  const navigate = useNavigate()

  const { currentUser } = useAuth()

  const captchaRef = useRef<ReCAPTCHA | null>(null)

  const {
    value: isCaptcharVerified,
    setTrue: setIsCaptcharVerified,
    setFalse: setIsNotCaptcharVerified
  } = useBoolean(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleRegister = async (data: IRegisterData) => {
    mutateRegister(data)
  }

  const {
    mutate: mutateRegister,
    isPending,
    error,
    isError,
    isSuccess
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, IRegisterData>({
    mutationFn: authApi.register,
    onSuccess: () => {
      message.success('Registration successful! Please check your email.')
    },
    onError: () => {
      captchaRef.current?.reset()
      setIsNotCaptcharVerified()
    }
  })

  const onBack = () => {
    navigate('/')
  }

  useEffect(() => {
    if (currentUser) {
      navigate('/')
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
        {isSuccess ? (
          <Result
            className='w-full lg:flex-1 animate-fadeIn'
            status='success'
            title='Successfully! Please check your email!'
            extra={[
              <Link
                to={PATH.LOGIN}
                className='bg-[#52c41a] px-4 py-3 font-bold rounded-md text-white hover:text-white hover:opacity-80'
              >
                Login
              </Link>
            ]}
          />
        ) : (
          <div className='flex flex-1 bg-white xs:w-full pb-4'>
            <div className='m-auto w-[80%]'>
              <h1 className='text-3xl font-semibold'>Sign up</h1>
              {isError && (
                <span className='inline-block text-red-500 mb-2 text-lg'>{error?.response?.data.message}</span>
              )}
              <br />
              <span className='text-lg'>If you already have an account.</span>
              <br />
              <span className='text-lg inline-block mr-2'>You can</span>
              <Link to={PATH.LOGIN} className='text-lg text-primary-500 font-semibold hover:underline'>
                Login here!
              </Link>
              <Form className='mt-6' onFinish={handleSubmit(handleRegister)} layout='vertical'>
                {AUTH_FIELDS.map((field) => (
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
                ))}
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={ENVIRONMENT_KEYS.VITE_CAPTCHAR_SITE_KEY}
                  onChange={setIsCaptcharVerified}
                  className='mt-4'
                />
                <CustomBtn
                  title='Register'
                  type='primary'
                  htmlType='submit'
                  className='mt-4'
                  disabled={isPending || !isCaptcharVerified}
                  loading={isPending}
                />
              </Form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

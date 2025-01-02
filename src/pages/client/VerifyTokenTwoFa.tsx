import * as yup from 'yup'
import { AxiosError } from 'axios'
import React, { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Input, Row, Col, Form, message } from 'antd'

import { authApi } from '@/apis'
import { useAuth } from '@/hooks'
import { CustomBtn } from '@/components'
import { IErrorResponse, ILoginResultWithTokens } from '@/interfaces'

type FormData = {
  otp: string[]
}

type VerifyTokenTwoFaProps = {
  showHeader?: boolean
  userTwoFaId?: string
  onVerifySuccess: () => void
}
const otpSchema = yup.object().shape({
  otp: yup.array().required().length(6).of(yup.string().required('Otp must have fill full'))
})

export const VerifyTokenTwoFa: React.FC<VerifyTokenTwoFaProps> = ({
  showHeader = true,
  userTwoFaId,
  onVerifySuccess
}) => {
  const { currentUser } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string>('')

  const inputs = useRef<Array<HTMLInputElement | null>>([])

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      otp: Array(6).fill('')
    }
  })

  const otpValue = watch('otp') || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target
    if (/^[0-9]{0,1}$/.test(value)) {
      const otp = getValues('otp') || []
      otp[index] = value
      setValue('otp', otp)
      if (value && index < otp.length - 1) {
        inputs.current[index + 1]?.focus()
      }
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey) {
      e.preventDefault()
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (index > 0) {
        inputs.current[index - 1]?.focus()
      }
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const onSubmit = (data: FormData) => {
    const otpValue = data.otp.join('')
    mutateVerifyTokenTwoFa(otpValue)
  }

  const {
    mutate: mutateVerifyTokenTwoFa,
    isPending: isPendingVerify,
    isError
  } = useMutation<ILoginResultWithTokens, AxiosError<IErrorResponse>, string>({
    mutationFn: async (token: string) => {
      const verifyTokenTwoFaPayload = {
        userId: currentUser?.id || userTwoFaId || '',
        token
      }
      return authApi.verifyTokenTwoFa(verifyTokenTwoFaPayload)
    },
    onSuccess: () => {
      onVerifySuccess()
      message.success('Verify totp successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      setErrorMessage(errorMessage)
    }
  })
  return (
    <div className='flex flex-1 bg-white items-center'>
      <div className='max-w-md mx-auto text-center bg-white px-4 xs:px-1 sm:px-8 py-10 rounded-xl'>
        {showHeader && (
          <header className='mb-2'>
            <h1 className='text-2xl font-bold mb-1'>Verify Your Account</h1>
            <span className='text-base text-slate-600'>Please enter your code in google authenticator app</span>
          </header>
        )}
        <Form onFinish={handleSubmit(onSubmit)}>
          <Row gutter={6}>
            <Col className='flex justify-between w-full'>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Form.Item
                    key={index}
                    className={`mb-0 border-0 mt-4 text-lg font-normal ${index !== 5 && 'mr-2'}`}
                    validateStatus={errors?.otp ? 'error' : ''}
                  >
                    <Controller
                      name={`otp.${index}`}
                      control={control}
                      render={() => (
                        <Input
                          type='text'
                          value={otpValue[index]}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onFocus={handleFocus}
                          ref={(el) => (inputs.current[index] = el as HTMLInputElement | null)}
                          maxLength={1}
                          className='w-[50px] h-[50px] text-2xl text-center hover:!border-primary-800 focus-within:!border-primary-800 focus-within:!shadow-custom'
                        />
                      )}
                    />
                  </Form.Item>
                ))}
            </Col>
          </Row>
          {isError && <span className='inline-block w-full py-2 text-red-500 text-lg text-left'>{errorMessage}!</span>}
          <CustomBtn
            title='Verify'
            type='primary'
            htmlType='submit'
            disabled={isPendingVerify}
            loading={isPendingVerify}
            className='mt-2'
          />
        </Form>
      </div>
    </div>
  )
}

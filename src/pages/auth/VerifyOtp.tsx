import * as yup from 'yup'
import React, { useRef } from 'react'
import { Input, Row, Col, Form } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { CustomBtn } from '@/components'

type VerifyOtpProps = {
  loading: boolean
  errorMessage?: string
  onVerifyOtp: (otp: string) => void
}
type FormData = {
  otp: string[]
}

const otpSchema = yup.object().shape({
  otp: yup.array().required().length(6).of(yup.string().required('Otp must have fill full'))
})
export function VerifyOtp({ loading, errorMessage, onVerifyOtp }: VerifyOtpProps) {
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
    onVerifyOtp(otpValue)
  }

  return (
    <div className='flex flex-1 bg-white'>
      <div className='max-w-md mx-auto text-center bg-white px-4 xs:px-1 sm:px-8 py-10 rounded-xl'>
        <header>
          <h1 className='text-2xl font-bold mb-1'>Verify Your Account</h1>
          <span className='text-base text-slate-600'>
            A 6-digit OTP code has been sent via your email.
            <br />
            Please enter the code below
          </span>
          {errorMessage && <span className='inline-block text-red-500 my-2 text-lg'>{errorMessage}</span>}
        </header>
        <Form id='otp-form' onFinish={handleSubmit(onSubmit)}>
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

          <CustomBtn title='Verify' type='primary' htmlType='submit' disabled={loading} className='mt-4' />
        </Form>
      </div>
    </div>
  )
}

import * as yup from 'yup'
import { Form } from 'antd'
import { useForm } from 'react-hook-form'
import { CustomBtn, CustomInput } from '@/components'
import { yupResolver } from '@hookform/resolvers/yup'

import { AUTH_FIELDS } from '@/utils/constants'

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 6 characters long')
    .required('Please input your new password!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your new password!')
})

type ResetPasswordData = {
  password: string
  confirmPassword: string
}

type NewPasswordProps = {
  loading: boolean
  errorMessage?: string
  handleResetPassword: (data: ResetPasswordData) => Promise<void>
}

export function Newpassword({ loading, errorMessage, handleResetPassword }: NewPasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordSchema)
  })

  return (
    <section className='xs:px-4 md:px-0'>
      <h1 className='text-3xl font-semibold'>Reset Password</h1>
      {errorMessage && <span className='inline-block text-red-500 mb-2 text-lg'>{errorMessage}</span>}
      <Form className='flex flex-col gap-2' onFinish={handleSubmit(handleResetPassword)} layout='vertical'>
        {AUTH_FIELDS.map((field) => {
          if (field.name === 'password' || field.name === 'confirmPassword')
            return (
              <CustomInput
                name={field.name}
                label={field.label}
                size='large'
                type={field.type}
                control={control}
                errors={errors}
                placeholder={field.placeholder}
              />
            )
        })}

        <CustomBtn title='Reset Password' type='primary' htmlType='submit' disabled={loading} loading={loading} className='mt-4' />
      </Form>
    </section>
  )
}

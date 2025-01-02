import * as yup from 'yup'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { Collapse, CollapseProps, Form, message, Result } from 'antd'

import { authApi } from '@/apis'
import { useBoolean } from '@/hooks'
import { CustomBtn, CustomInput } from '@/components'
import { CHANGE_PASSWORD_FIELDS } from '@/utils/constants'
import { IChangePassWordData, IDataResponse, IErrorResponse } from '@/interfaces'

const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(8, 'Password needs to be at least 8 characters.')
    .required('Please input your current password!'),
  newPassword: yup
    .string()
    .min(8, 'Password needs to be at least 8 characters.')
    .required('Please input your new password!'),
  confirmPassword: yup
    .string()
    .required('Please input your new password again!')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

export const ChangePassword = () => {
  const {
    value: showSuccessResult,
    setTrue: setShowSuccessResult,
    setFalse: setHiddenSuccessResult
  } = useBoolean(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(changePasswordSchema)
  })

  const handleChangePassword = async (changePasswordData: IChangePassWordData) => {
    mutateChangePassword(changePasswordData)
  }

  const {
    mutate: mutateChangePassword,
    isPending,
    error,
    isError
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, IChangePassWordData>({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      setShowSuccessResult()
      reset()
      setTimeout(() => {
        setHiddenSuccessResult()
      }, 3000)
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Change password failed ' + errorMessage)
    }
  })

  const changePasswordItems: CollapseProps['items'] = [
    {
      key: '1',
      label: <h3>Change password</h3>,
      children: (
        <div className='flex flex-col bg-white gap-4'>
          <p className='font-normal text-base'>Choose a strong password and don't reuse it for other accounts.</p>
          <p className='font-normal text-base'>
            <span className='font-medium'>Password strength:</span> Use at least 8 characters. Don’t use a password from
            another site, or something too obvious like your pet’s name.
          </p>
          <div className='flex justify-center'>
            {showSuccessResult ? (
              <Result className='flex-1 animate-fadeIn' status='success' title='Change password successfully' />
            ) : (
              <Form
                className='md:min-w-[400px] lg:min-w-[500px] max-w-[500px]'
                onSubmitCapture={handleSubmit(handleChangePassword)}
                layout='vertical'
              >
                {CHANGE_PASSWORD_FIELDS.map((field) => (
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
                {isError && <span className='text-red-500 mb-2 text-lg'>{error.response?.data.message}</span>}
                <CustomBtn
                  title='Change password'
                  type='primary'
                  htmlType='submit'
                  disabled={isPending || !isDirty}
                  loading={isPending}
                  className='mt-4'
                />
              </Form>
            )}
          </div>
        </div>
      )
    }
  ]

  return (
    <section>
      <Collapse items={changePasswordItems} defaultActiveKey={['1']} expandIconPosition='end'></Collapse>
    </section>
  )
}

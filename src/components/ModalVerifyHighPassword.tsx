import React from 'react'
import * as yup from 'yup'
import { Form, Modal } from 'antd'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

import { highLevelPasswordApi } from '@/apis'
import { IDataResponse, IErrorResponse, IVerifyHighLevelPassword } from '@/interfaces'

import { CustomBtn } from './CustomBtn'
import { CustomInput } from './CustomInput'

type ModalVerifyHighPasswordProps = {
  isOpen: boolean
  handleCancel: () => void
  handleVerifySuccess: () => void
}

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .max(10, 'Password needs to be max 10 characters.')
    .min(4, 'Password needs to be min 4 characters.')
    .required('Please input your the password!')
})

export const ModalVerifyHighPassword: React.FC<ModalVerifyHighPasswordProps> = ({
  isOpen = false,
  handleCancel,
  handleVerifySuccess
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordSchema)
  })

  const {
    mutate: mutateVerify,
    isPending: isPendingVerify,
    error,
    isError,
    reset: resetMutate
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, IVerifyHighLevelPassword>({
    mutationFn: highLevelPasswordApi.verify,
    onSuccess: () => {
      reset({ password: '' })
      handleCancel()
      handleVerifySuccess()
    }
  })

  const handleVerify = (data: IVerifyHighLevelPassword) => {
    mutateVerify(data)
  }

  const handleOnCancel = () => {
    reset({ password: '' })
    handleCancel()
    resetMutate()
  }

  return (
    <Modal open={isOpen} onCancel={handleOnCancel} footer={null}>
      <Form layout='vertical' onFinish={handleSubmit(handleVerify)}>
        <CustomInput
          name='password'
          label='High level password'
          size='large'
          type='password'
          control={control}
          errors={errors}
          placeholder='Enter your high level password'
        />
        {isError && <span className='text-red-500 text-base'>{error.response?.data.message}</span>}
        <CustomBtn
          title='Verify'
          type='primary'
          htmlType='submit'
          disabled={isPendingVerify || (isError && error.response?.data.status === 429)}
          loading={isPendingVerify}
          className='mt-4'
        />
      </Form>
    </Modal>
  )
}

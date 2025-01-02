import * as yup from 'yup'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Form, message, Modal } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountApi } from '@/apis'
import { accountKeys } from '@/keys'
import {
  IAccountDataResponse,
  ICreateAccountData,
  IDataResponse,
  IErrorResponse,
  IUpdateAccountData
} from '@/interfaces'
import { decryptPassword } from '@/utils/helpers'
import { ACCOUNT_FIELDS } from '@/utils/constants'
import { CustomBtn, CustomInput } from '@/components'

type CreateAccountProps = {
  currentAccount?: IAccountDataResponse
  isShowCreateAccountForm: boolean
  handleCancelUpdateAccount?: () => void
  toggleShowCreateAccountForm: () => void
}

const createAccountSchema = yup.object().shape({
  username: yup.string().required('Credential is required!'),
  password: yup.string().required('Password is required!'),
  domain: yup.string().required('Domain is required!')
})

export const CreateAccount: React.FC<CreateAccountProps> = ({
  currentAccount,
  isShowCreateAccountForm = false,
  toggleShowCreateAccountForm,
  handleCancelUpdateAccount
}) => {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(createAccountSchema)
  })

  const { mutate: mutateSaveAccount, isPending } = useMutation<
    IDataResponse,
    AxiosError,
    ICreateAccountData | IUpdateAccountData
  >({
    mutationFn: (data) => {
      if (currentAccount) {
        return accountApi.update(data as IUpdateAccountData)
      }
      return accountApi.create(data as ICreateAccountData)
    },
    onSuccess: () => {
      handleCloseForm()
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      message.success('Save account successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const handleSaveAccount = (data: ICreateAccountData | IUpdateAccountData) => {
    mutateSaveAccount({ ...data, accountId: currentAccount?.id })
  }

  const handleCloseForm = () => {
    reset({})
    toggleShowCreateAccountForm()
    if (handleCancelUpdateAccount) {
      handleCancelUpdateAccount()
    }
  }

  useEffect(() => {
    if (currentAccount) {
      reset({ ...currentAccount, password: decryptPassword(currentAccount?.password) })
    } else {
      reset({})
    }
  }, [isShowCreateAccountForm])

  return (
    <Modal open={isShowCreateAccountForm} footer={null} onCancel={handleCloseForm}>
      <Form className='flex flex-col gap-2 bg-white xs:p-0 md:p-2' onFinish={handleSubmit(handleSaveAccount)} layout='vertical'>
        {ACCOUNT_FIELDS.map((field) => (
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

        <CustomBtn
          title='Save'
          type='primary'
          htmlType='submit'
          disabled={isPending || !isDirty}
          loading={isPending}
          className='md:!mt-6 xs:!mt-2'
        />
      </Form>
    </Modal>
  )
}

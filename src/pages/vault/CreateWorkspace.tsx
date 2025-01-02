import * as yup from 'yup'
import { AxiosError } from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { Form, Modal, Select, Typography, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { workspaceApi } from '@/apis'
import { accountKeys, workspaceKeys } from '@/keys'
import { CustomBtn, CustomInput } from '@/components'
import {
  IAccountDataResponse,
  IAccountDataResponsePaginate,
  IDataResponse,
  IErrorResponse,
  IPaginationParams,
  IWorkspaceDataResponse,
  IWorkspaceInputData,
  IWorkspaceUpdateData
} from '@/interfaces'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks'

const { Text } = Typography

type accountOption = {
  label: string
  value: string
}

type CreateWorkspaceProps = {
  currentWorkspace?: IWorkspaceDataResponse
  isShowCreateForm: boolean
  handleCancel?: () => void
  toggleShowCreateForm: () => void
}

const createWorkspaceSchema = yup.object().shape({
  name: yup.string().required('Name is required!'),
  accounts: yup.array().default([])
})

export const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  currentWorkspace,
  isShowCreateForm = false,
  handleCancel,
  toggleShowCreateForm
}) => {
  const queryClient = useQueryClient()

  const [queryParams, setQueryParams] = useState<IPaginationParams>({
    page: 1,
    limit: 20
  })

  const { data, isFetching } = useQuery<IAccountDataResponsePaginate, AxiosError<IErrorResponse>>({
    ...accountKeys.list(queryParams as IPaginationParams),
    enabled: !!queryParams
  })

  const [searchValue, setSearchValue] = useState<string>('')

  const debouncedInputValue = useDebounce(searchValue, 600)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(createWorkspaceSchema)
  })

  const { mutate, isPending } = useMutation<IDataResponse, AxiosError, IWorkspaceInputData | IWorkspaceUpdateData>({
    mutationFn: (data) => {
      if (currentWorkspace) {
        return workspaceApi.update(data as IWorkspaceUpdateData)
      }
      return workspaceApi.create(data)
    },
    onSuccess: () => {
      handleCloseForm()
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      message.success('Save workspace successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const handleSaveWorkspace = (data: IWorkspaceInputData) => {
    mutate({ ...currentWorkspace, ...data })
  }

  const accountOptions: accountOption[] = data?.accounts
    ? data?.accounts.map((account: IAccountDataResponse) => ({
        label: `${account.domain} (${account.username})`,
        value: account.id
      }))
    : []

  const handleCloseForm = () => {
    reset({})
    toggleShowCreateForm()
    if (handleCancel) handleCancel()
  }

  const handleSearchAccount = (searchValue: string) => {
    setSearchValue(searchValue)
  }

  useEffect(() => {
    if (currentWorkspace) {
      reset({ ...currentWorkspace, accounts: currentWorkspace.accounts?.map((account) => account.id) })
    } else {
      reset({})
    }
  }, [isShowCreateForm])

  useEffect(() => {
    setQueryParams({
      page: 1,
      limit: 20,
      keyword: debouncedInputValue
    })
  }, [debouncedInputValue])

  return (
    <Modal open={isShowCreateForm} footer={null} onCancel={handleCloseForm}>
      <Form
        className='flex flex-col gap-4 bg-white xs:p-0 md:p-2'
        layout='vertical'
        onFinish={handleSubmit(handleSaveWorkspace)}
      >
        <CustomInput
          name='name'
          size='large'
          label='Name'
          control={control}
          errors={errors}
          placeholder='Enter workspace name'
        />
        <div className='flex flex-col text-left'>
          <label className='text-lg font-normal text-slate-800'>Accounts</label>
          <Controller
            name='accounts'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode='multiple'
                placeholder='Select accounts'
                options={accountOptions}
                onChange={(value) => {
                  field.onChange(value)
                }}
                defaultValue={
                  currentWorkspace?.accounts?.map((account) => ({
                    label: `${account.domain} (${account.username})`,
                    value: account.id
                  }))
                }
                onSearch={handleSearchAccount}
                searchValue={searchValue}
                loading={isFetching}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            )}
          />
          {errors.accounts && <Text type='danger'>{errors.accounts.message}</Text>}
        </div>
        <CustomBtn
          title='Save'
          type='primary'
          htmlType='submit'
          disabled={isPending || !isDirty}
          loading={isPending}
          className='!mt-6'
        />
      </Form>
    </Modal>
  )
}

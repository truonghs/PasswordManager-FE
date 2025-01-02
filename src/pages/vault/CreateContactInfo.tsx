import * as yup from 'yup'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Drawer, Form, message } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { contactInfoApi } from '@/apis'
import { contactInfoKeys } from '@/keys'
import { CustomBtn, CustomInput } from '@/components'
import { CONTACTINFO_FIELDS } from '@/utils/constants'
import {
  IContactInfoDataResponse,
  ICreateContactInfo,
  IDataResponse,
  IErrorResponse,
  IUpdateContactInfoData
} from '@/interfaces'

type CreateContactInfoProps = {
  currentContactInfo?: IContactInfoDataResponse
  isShowCreateContactInfoForm: boolean
  handleCancelUpdateContactInfo?: () => void
  toggleShowCreateContactInfoForm: () => void
}

const createContactInfoSchema = yup.object().shape({
  title: yup.string().required('Please enter name of contact info!'),
  firstName: yup.string(),
  midName: yup.string(),
  lastName: yup.string(),
  street: yup.string(),
  city: yup.string(),
  country: yup.string(),
  email: yup.string().email('Please enter a valid email!'),
  phoneNumber: yup.string()
})

export const CreateContactInfo: React.FC<CreateContactInfoProps> = ({
  currentContactInfo,
  isShowCreateContactInfoForm,
  handleCancelUpdateContactInfo,
  toggleShowCreateContactInfoForm
}) => {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(createContactInfoSchema)
  })

  const { mutate: mutateSaveContactInfo, isPending } = useMutation<
    IDataResponse,
    AxiosError,
    ICreateContactInfo | IUpdateContactInfoData
  >({
    mutationFn: (data) => {
      if (currentContactInfo) {
        return contactInfoApi.update(data as IUpdateContactInfoData)
      }
      return contactInfoApi.create(data as ICreateContactInfo)
    },
    onSuccess: () => {
      reset()
      handleCloseForm()
      queryClient.invalidateQueries({ queryKey: contactInfoKeys.lists() })
      message.success('Save contact info successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const handleSaveContactInfo = (data: ICreateContactInfo | IUpdateContactInfoData) => {
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof ICreateContactInfo]) {
        delete data[key as keyof ICreateContactInfo]
      }
    })
    mutateSaveContactInfo({ ...data, contactInfoId: currentContactInfo?.id })
  }

  const handleCloseForm = () => {
    reset({})
    toggleShowCreateContactInfoForm()
    if (handleCancelUpdateContactInfo) {
      handleCancelUpdateContactInfo()
    }
  }

  useEffect(() => {
    if (currentContactInfo) {
      reset(currentContactInfo)
    } else {
      reset({})
    }
  }, [isShowCreateContactInfoForm])

  return (
    <Drawer
      title={currentContactInfo ? 'Edit contact' : 'Create a new contact'}
      onClose={handleCloseForm}
      open={isShowCreateContactInfoForm}
      width={500}
      extra={
        <CustomBtn
          title='Save'
          type='primary'
          htmlType='submit'
          disabled={isPending || !isDirty}
          loading={isPending}
          className='!mt-0 !w-fit !px-8'
          onClick={handleSubmit(handleSaveContactInfo)}
        />
      }
    >
      <Form className='flex flex-col bg-white px-6 pb-6 gap-2' layout='vertical'>
        {CONTACTINFO_FIELDS.map((field) => (
          <CustomInput
            key={field.name}
            name={field.name}
            size='large'
            type={field.type}
            label={field.label}
            control={control}
            errors={errors}
          />
        ))}
      </Form>
    </Drawer>
  )
}

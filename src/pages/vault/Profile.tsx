import * as yup from 'yup'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import type { GetProp, UploadProps } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { UploadRequestOption } from 'rc-upload/lib/interface'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Col, Form, Image, message, Row, Spin, Upload } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/apis'
import { userKeys } from '@/keys'
import { useBoolean, useAuth } from '@/hooks'
import { PROFILE_FIELDS } from '@/utils/constants'
import { uploadToCloudinary } from '@/utils/helpers'
import { CustomBtn, CustomInput, UpgradeSubscription } from '@/components'
import { ICurrentUser, IErrorResponse, IUpdateProfileData } from '@/interfaces'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const profileSchema = yup.object().shape({
  name: yup.string().required('Please input your name!'),
  email: yup.string(),
  phoneNumber: yup.string().default(null)
})

export const Profile = () => {
  const queryClient = useQueryClient()

  const { currentUser, isPending: isPendingUser } = useAuth()

  const [imageUrl, setImageUrl] = useState<string>('')

  const [previewImage, setPreviewImage] = useState<string>('')

  const { value: previewOpen, toggle: setPreviewOpen } = useBoolean(false)

  const upgradeModalControl = useBoolean(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(profileSchema)
  })

  const handleUpdateProfile = async (updateProfileData: IUpdateProfileData) => {
    const updateProfilePayload = { ...updateProfileData, avatar: imageUrl }
    mutateUpdateProfile(updateProfilePayload)
  }

  const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } = useMutation<
    ICurrentUser,
    AxiosError<IErrorResponse>,
    IUpdateProfileData
  >({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      message.success('Update profile successfully!')
      queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Update profile failed ' + errorMessage)
    }
  })

  const handleUploadImage = async (options: UploadRequestOption) => {
    const { file } = options
    mutateUploadImage(file as FileType)
  }

  const { mutate: mutateUploadImage, isPending: isPendingUploadImage } = useMutation<
    string,
    AxiosError<IErrorResponse>,
    FileType
  >({
    mutationFn: uploadToCloudinary,
    onSuccess: (uploadedUrl: string) => {
      setImageUrl(uploadedUrl)
      message.success('Image uploaded successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Failed to upload image!' + errorMessage)
    }
  })

  const handlePreviewImage = () => {
    setPreviewImage(imageUrl)
    setPreviewOpen()
  }

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    if (!imageUrl && currentUser?.avatar) {
      setImageUrl(currentUser?.avatar || '')
    }
    if (currentUser) reset(currentUser)
  }, [currentUser])

  return (
    <section className='flex bg-white xs:px-0 md:p-6'>
      <div className='flex flex-col gap-10 m-auto py-6'>
        <article className='flex flex-col justify-start  text-slate-800 text-lg'>
          <h3 className='font-semibold'>Personal information</h3>
          <span>Use a permanent address where you can receive mail.</span>
        </article>
        {isPendingUser ? (
          <Spin size='large' />
        ) : (
          <Row className='flex-col md:flex-row xs:gap-8 md:gap-10 xl:gap-20 items-center justify-center'>
            <Col className='flex flex-col justify-between items-center h-full'>
              <div className='flex flex-col items-start gap-2 justify-between h-full'>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  showUploadList={false}
                  className='!flex !justify-center'
                  customRequest={handleUploadImage}
                >
                  {imageUrl ? (
                    <div className='relative w-full h-full'>
                      <img src={imageUrl} alt='avatar' className='w-full h-full rounded-md' />
                    </div>
                  ) : (
                    <button className='flex flex-col items-center justify-between border-0 outline-none' type='button'>
                      {isPendingUploadImage ? <LoadingOutlined /> : <PlusOutlined />}
                      <span className='mt-2 text-lg text-slate-800'>Upload</span>
                    </button>
                  )}
                </Upload>
                {imageUrl && (
                  <CustomBtn
                    title='Preview'
                    onClick={handlePreviewImage}
                    className='w-full text-lg bg-[#fafafa] mt-4 p-2 rounded-md'
                  />
                )}
                <div>
                  <div className='flex gap-4 items-center'>
                    <span className=' text-xl'>Subscription:</span>
                    <span
                      className={` text-xl ${currentUser?.subscription === 'FREE' ? 'text-green-500' : 'text-yellow-500'} font-semibold`}
                    >
                      {currentUser?.subscription}
                    </span>
                  </div>
                  <div className='text-base flex'>
                    Are you want to
                    <div
                      className='text-blue-500 cursor-pointer hover:font-semibold min-w-16 mx-1'
                      onClick={() => upgradeModalControl.setTrue()}
                    >
                      upgrade
                    </div>
                    your subscription?
                  </div>
                </div>
              </div>
            </Col>
            <Col className='w-full md:flex-1'>
              <Form
                className='flex flex-col gap-2 md:min-w-[400px] lg:min-w-[500px]  h-full'
                onSubmitCapture={handleSubmit(handleUpdateProfile)}
                layout='vertical'
              >
                {PROFILE_FIELDS.map((field) => {
                  return (
                    field.name !== 'avatar' && (
                      <CustomInput
                        key={field.name}
                        name={field.name}
                        size='large'
                        type={field.type}
                        disabled={field.name === 'email'}
                        label={field.label}
                        control={control}
                        errors={errors}
                        placeholder={field.placeholder}
                      />
                    )
                  )
                })}

                <CustomBtn
                  title='Save'
                  type='primary'
                  htmlType='submit'
                  disabled={(isPendingUpdateProfile || !isDirty) && imageUrl === currentUser?.avatar}
                  loading={isPendingUpdateProfile}
                  className='!mt-2'
                />
              </Form>
            </Col>
          </Row>
        )}
      </div>
      {upgradeModalControl && <UpgradeSubscription modalControl={upgradeModalControl} />}
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: setPreviewOpen,
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </section>
  )
}

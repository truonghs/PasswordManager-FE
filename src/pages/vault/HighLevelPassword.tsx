import * as yup from 'yup'
import { useEffect, memo } from 'react'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, message, Modal, Space, Switch, Tag, Collapse, Tooltip, CollapseProps, Skeleton } from 'antd'

import { userKeys } from '@/keys'
import { icons } from '@/utils/icons'
import { highLevelPasswordApi } from '@/apis'
import { useAuth, useBoolean } from '@/hooks'
import { STATUS_2FA } from '@/utils/constants'
import { CustomBtn, CustomInput, ModalVerifyHighPassword } from '@/components'
import { ICreateHighLevelPassword, IDataResponse, IErrorResponse } from '@/interfaces'

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .max(10, 'Password needs to be max 10 characters.')
    .min(4, 'Password needs to be min 4 characters.')
    .required('Please input your the password!')
})

export const HighLevelPassword = memo(() => {
  const queryClient = useQueryClient()

  const { currentUser, isPending: isFetchingUser } = useAuth()

  const { value: isEnableHighPassword, setValue: setIsEnableHighPassword } = useBoolean(false)

  const { value: isWaringTurnOff, toggle: toggleWaringTurnOff, setFalse: hiddenWarningTurnOff } = useBoolean(false)

  const { value: isShowEnableHighLevelPassword, toggle: toggleShowHighLevelPassword } = useBoolean(false)

  const { value: isOpenVerifyHighPassword, toggle: toggleOpenVerifyHighPassword } = useBoolean(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordSchema)
  })

  const handleEnableHighLevelPassword = async (data: ICreateHighLevelPassword) => {
    mutateCreate(data)
  }

  const handleToggleSettingHighPassword = () => {
    mutateToggleHighPassword()
  }

  const handleConfirmTurnOffTwoFa = () => {
    if (isEnableHighPassword) {
      toggleOpenVerifyHighPassword()
    } else {
      toggleWaringTurnOff()
    }
  }

  const handleVerifySuccess = () => {
    toggleWaringTurnOff()
  }

  const {
    mutate: mutateCreate,
    isPending: isPendingCreate,
    error,
    isError
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, ICreateHighLevelPassword>({
    mutationFn: highLevelPasswordApi.create,
    onSuccess: () => {
      reset()
      toggleShowHighLevelPassword()
      message.success('Create high level password successfully!')
      queryClient.invalidateQueries(userKeys.profile())
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Change password failed ' + errorMessage)
    }
  })

  const { mutate: mutateToggleHighPassword, isPending: isPendingToggle } = useMutation<
    IDataResponse,
    AxiosError<IErrorResponse>
  >({
    mutationFn: highLevelPasswordApi.toggle,
    onSuccess: () => {
      reset()
      message.success('Change setting high level password successfully!')
      hiddenWarningTurnOff()
      queryClient.invalidateQueries(userKeys.profile())
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  const renderSwitchContent = () => {
    if (currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.DISABLED)) {
      return <Switch checked={false} onChange={() => mutateToggleHighPassword()} className='!w-fit' />
    } else if (currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)) {
      return <Switch checked onChange={handleConfirmTurnOffTwoFa} className='!w-fit' />
    }
    return <Switch checked={isShowEnableHighLevelPassword} onChange={toggleShowHighLevelPassword} className='!w-fit' />
  }

  const highLevelPasswordItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className='flex items-center gap-2'>
          <h3>High-level password</h3>
          {isEnableHighPassword ? (
            <Tooltip title='Your account is secure!' color='green' className='font-semibold'>
              <Tag bordered={false} color='green' className='text-lg text-wrap !w-fit !p-0'>
                <span className='text-2xl'>{icons.checkmark}</span>
              </Tag>
            </Tooltip>
          ) : (
            <Tooltip title='Your account is not secure!' color='gold' className='font-semibold'>
              <Tag bordered={false} color='warning' className='text-lg text-wrap !w-fit !p-0'>
                <span className='text-2xl'>{icons.warning}</span>
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
      children: (
        <Skeleton loading={isPendingCreate || isPendingToggle || isFetchingUser} active>
          <div className='flex flex-col gap-4'>
            <p className='font-normal text-base'>
              When using an account or workspace, you need to provide a level 2 password to avoid hackers using it.
            </p>
            <Tag bordered={false} color='blue' className='text-lg text-wrap !w-fit px-2'>
              {isEnableHighPassword ? 'Turn off' : 'Enable it to secure your account'}
            </Tag>
            {renderSwitchContent()}
            {isShowEnableHighLevelPassword && (
              <div className='flex flex-col md:flex-row justify-center bg-white transition-all duration-500 ease-in-out transform scale-95 animate-fadeIn'>
                <Form
                  className='md:min-w-[400px] lg:min-w-[500px]'
                  layout='vertical'
                  onFinish={handleSubmit(handleEnableHighLevelPassword)}
                >
                  <CustomInput
                    name='password'
                    label='High level password'
                    size='large'
                    type='password'
                    control={control}
                    errors={errors}
                    placeholder='Enter your high level password'
                  />
                  {isError && <span className='text-red-500 mb-2 text-lg'>{error.response?.data.message}</span>}
                  <CustomBtn
                    title='Create'
                    type='primary'
                    htmlType='submit'
                    disabled={isPendingCreate}
                    loading={isPendingCreate}
                    className='mt-4'
                  />
                </Form>
              </div>
            )}
          </div>
        </Skeleton>
      )
    }
  ]

  useEffect(() => {
    if (currentUser) {
      setIsEnableHighPassword(
        currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)
      )
    }
  }, [currentUser])

  return (
    <section>
      <Modal
        open={isWaringTurnOff}
        title='Warning'
        onCancel={toggleWaringTurnOff}
        footer={
          <Space className='flex items-center justify-end gap-x-4'>
            <CustomBtn
              title='Cancel'
              onClick={toggleWaringTurnOff}
              className='border !border-gray-500 !text-slate-800'
            />
            <CustomBtn
              title='Turn off'
              type='primary'
              onClick={handleToggleSettingHighPassword}
              disabled={isPendingToggle}
              loading={isPendingToggle}
              className='bg-red-500 hover:!bg-red-600'
            />
          </Space>
        }
      >
        <span className='text-base'>Are you sure you want to turn off high level password?</span>
      </Modal>
      {currentUser && (
        <div className='flex flex-col gap-y-2'>
          <Collapse items={highLevelPasswordItems} defaultActiveKey={['1']} expandIconPosition='end'></Collapse>
        </div>
      )}
      <ModalVerifyHighPassword
        isOpen={isOpenVerifyHighPassword}
        handleCancel={toggleOpenVerifyHighPassword}
        handleVerifySuccess={handleVerifySuccess}
      />
    </section>
  )
})

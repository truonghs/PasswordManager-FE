import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Collapse, CollapseProps, message, Modal, Skeleton, Space, Switch, Tag, Tooltip } from 'antd'

import { userKeys } from '@/keys'
import { icons } from '@/utils/icons'
import { twoFactorAuthApi } from '@/apis'
import { useAuth, useBoolean } from '@/hooks'
import { STATUS_2FA } from '@/utils/constants'
import { CustomBtn, ModalVerifyHighPassword } from '@/components'
import { ChangePassword, HighLevelPassword, TwoFARecommendation } from '@/pages'

export const Settings = () => {
  const queryClient = useQueryClient()

  const { currentUser, isLoading: isFetchingUser } = useAuth()

  const { value: isWaringDisable, toggle: toggleWaringDisable } = useBoolean(false)

  const { value: isShowEnableTwoFa, toggle: toggleShowEnableTwoFa } = useBoolean(false)

  const { value: isOpenVerifyHighPassword, toggle: toggleOpenVerifyHighPassword } = useBoolean(false)

  const { mutate: mutateDisableTwoFa, isPending: isPendingDisableTwoFa } = useMutation({
    mutationFn: twoFactorAuthApi.disableTwoFa,
    onSuccess: () => {
      toggleWaringDisable()
      queryClient.invalidateQueries(userKeys.profile())
      message.success('Two-factor authentication has been disabled.')
    },
    onError: (error) => {
      message.error(error.message || 'Failed to disable two-factor authentication.')
    }
  })

  const handleTurnOffTwoFa = () => {
    mutateDisableTwoFa()
  }

  const handleConfirmTurnOffTwoFa = () => {
    if (currentUser && currentUser?.highLevelPasswords?.some((password) => password.status === STATUS_2FA.ENABLED)) {
      toggleOpenVerifyHighPassword()
    } else {
      toggleWaringDisable()
    }
  }

  const twoFaEnableItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className='flex items-center gap-2'>
          <h3>Two-factor authentication</h3>
          <Tooltip title='Your account is not secure!' color='gold' className='font-semibold'>
            <Tag bordered={false} color='warning' className='text-lg text-wrap !w-fit !p-0'>
              <span className='text-2xl'>{icons.warning}</span>
            </Tag>
          </Tooltip>
        </div>
      ),
      children: (
        <Skeleton loading={isPendingDisableTwoFa || isFetchingUser} active>
          <div className='flex flex-col gap-4'>
            <p className='text-black font-normal text-base'>
              Two-factor authentication (2FA) adds an extra layer of security by requiring a second verification step,
              like a code sent to your phone, alongside your password.
            </p>
            <Tag bordered={false} color='blue' className='text-lg text-wrap !w-fit px-2'>
              Enable it to secure your account
            </Tag>
            <Switch checked={isShowEnableTwoFa} onChange={toggleShowEnableTwoFa} className='!w-fit' />
            {isShowEnableTwoFa && (
              <div className='transition-all duration-500 ease-in-out transform scale-95 animate-fadeIn'>
                <TwoFARecommendation />
              </div>
            )}
          </div>
        </Skeleton>
      )
    }
  ]

  const twoFaDisableItems: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className='flex items-center gap-2'>
          <h3>Two-factor authentication</h3>
          <Tooltip title='Your account is secure!' color='green' className='font-semibold'>
            <Tag bordered={false} color='green' className='text-lg text-wrap !w-fit !p-0'>
              <span className='text-2xl'>{icons.checkmark}</span>
            </Tag>
          </Tooltip>
        </div>
      ),
      children: (
        <Skeleton loading={isPendingDisableTwoFa || isFetchingUser} active>
          <div className='flex flex-col gap-4'>
            <p className='text-black font-normal text-base'>
              Two-factor authentication (2FA) adds an extra layer of security by requiring a second verification step,
              like a code sent to your phone, alongside your password.
            </p>
            <Tag bordered={false} color='blue' className='text-lg text-wrap !w-fit px-2'>
              Turn off
            </Tag>
            <Switch checked onChange={handleConfirmTurnOffTwoFa} className='w-fit' />
          </div>
        </Skeleton>
      )
    }
  ]
  const renderTwoFaContent = () => {
    switch (currentUser?.status) {
      case STATUS_2FA.ENABLED:
        return <Collapse items={twoFaDisableItems} defaultActiveKey={['1']} expandIconPosition='end'></Collapse>

      default:
        return <Collapse items={twoFaEnableItems} defaultActiveKey={['1']} expandIconPosition='end'></Collapse>
    }
  }

  return (
    <section className='flex flex-col gap-8 bg-white xs:px-0 md:p-6'>
      <Modal
        open={isWaringDisable}
        title='Warning'
        onCancel={toggleWaringDisable}
        footer={
          <Space className='flex items-center justify-end gap-x-4'>
            <CustomBtn
              title='Cancel'
              onClick={toggleWaringDisable}
              className='border !border-gray-500 !text-slate-800'
            />
            <CustomBtn
              title='Disable'
              type='primary'
              onClick={handleTurnOffTwoFa}
              loading={isPendingDisableTwoFa}
              className='bg-red-500 hover:!bg-red-600'
            />
          </Space>
        }
      >
        <span className='text-base'>Are you sure you want to disable two-factor authentication?</span>
      </Modal>
      <ModalVerifyHighPassword
        isOpen={isOpenVerifyHighPassword}
        handleCancel={toggleOpenVerifyHighPassword}
        handleVerifySuccess={toggleWaringDisable}
      />
      {renderTwoFaContent()}
      <HighLevelPassword />
      <ChangePassword />
    </section>
  )
}

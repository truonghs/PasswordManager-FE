import { AxiosError } from 'axios'
import { useLocation } from 'react-router-dom'
import type { NotificationArgsProps } from 'antd'
import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Space, notification } from 'antd'
import { useMutation } from '@tanstack/react-query'

import { CustomBtn } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { locationApi, loginHistoryApi } from '@/apis'
import { IDataResponse, IErrorResponse, ILoginHistoryData } from '@/interfaces'
import { PATH, STATUS_2FA } from '@/utils/constants'

import { CustomFooter, CustomHeader } from './partials'

const { Content } = Layout
type NotificationPlacement = NotificationArgsProps['placement']

export const DefaultLayout = () => {
  const navigate = useNavigate()

  const location = useLocation()

  const { currentUser } = useAuth()

  const { value: isShowPopupConfirmSync, setTrue: setShowPopupConfirmSync } = useBoolean(false)

  const [api, contextHolder] = notification.useNotification()

  const handleSyncLoginToExtension = () => {
    api.destroy()
    window.postMessage({ message: 'syncLoginToExtension', userId: currentUser?.id }, window.location.origin)
  }

  const handleCancelSyncLoginToExtension = () => {
    api.destroy()
  }

  const { mutate: mutateStoreLoginHistory } = useMutation<IDataResponse, AxiosError<IErrorResponse>, ILoginHistoryData>(
    {
      mutationFn: loginHistoryApi.store
    }
  )

  const requestLocationAndSave = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const locationParams = {
              lat: latitude,
              lon: longitude,
              format: 'json'
            }
            const locationDetail = await locationApi.getLocationDetail(locationParams)

            mutateStoreLoginHistory({
              lat: latitude,
              lon: longitude,
              address: locationDetail.display_name
            })
          } catch (error) {
            console.error(error)
          }
        },
        (error) => {
          console.error('Location access denied', error)
        }
      )
    } else {
      console.warn('Geolocation is not supported by this browser.')
    }
  }

  useLayoutEffect(() => {
    const openNotification = (placement: NotificationPlacement) => {
      api.info({
        message: 'Do you want to sync login to extension?',
        description: (
          <Space className='w-full justify-between'>
            <CustomBtn
              title='Cancel'
              size='small'
              className='!text-sm !h-9'
              onClick={handleCancelSyncLoginToExtension}
            />
            <CustomBtn
              title='Sync'
              type='primary'
              size='small'
              className='!text-sm !h-9'
              onClick={handleSyncLoginToExtension}
            />
          </Space>
        ),
        placement,
        duration: 0
      })
    }

    if (location.state?.fromLogin && !isShowPopupConfirmSync && currentUser) {
      setShowPopupConfirmSync()
      openNotification('top')
      requestLocationAndSave()
    }
  }, [location, currentUser, isShowPopupConfirmSync])

  useEffect(() => {
    if (currentUser && currentUser.status === STATUS_2FA.NOT_REGISTERED && !currentUser?.isSkippedTwoFa) {
      navigate(PATH.TWO_FA_SUGGESTION)
    }
  }, [currentUser])

  return (
    <Layout className='min-h-screen overflow-x-hidden'>
      <CustomHeader />
      <Content className='mt-16'>
        {contextHolder}
        <Outlet />
      </Content>
      <CustomFooter />
    </Layout>
  )
}

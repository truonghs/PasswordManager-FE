import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { Result, ResultProps, Spin } from 'antd'
import { useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CustomBtn } from '@/components'
import { notificationKeys } from '@/keys'
import { IDataResponse, IErrorResponse } from '@/interfaces'
import { accountSharingInvitationApi, notificationApi } from '@/apis'
import { ENVIRONMENT_KEYS, ERROR_CODE, PATH } from '@/utils/constants'

export const ConfirmAccountInvitation = () => {
  const queryClient = useQueryClient()

  const { inviteId } = useParams<{ inviteId: string }>()

  const [searchParams] = useSearchParams()

  const notificationId = searchParams.get('notificationId')

  const {
    mutate: mutateConfirmAccountInvitation,
    isPending,
    error
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: accountSharingInvitationApi.confirm,
    onSuccess: () => {
      if (notificationId) {
        mutateSetReadNotification(notificationId)
      }
    }
  })

  const { mutate: mutateSetReadNotification } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: notificationApi.setReadNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(notificationKeys.list())
    }
  })

  const handleOpenExtension = () => {
    window.open(ENVIRONMENT_KEYS.VITE_EXTENSION_URL)
  }

  let errorDetails: ResultProps

  switch (error?.response?.data.errorCode) {
    case ERROR_CODE.USER_NOT_FOUND:
      errorDetails = {
        status: 'error',
        title: 'Your email has not been registered',
        subTitle: 'Please register a credential to use our service',
        extra: <CustomBtn title='Register' to={PATH.REGISTER} type='primary' className='!w-[120px]' />
      }
      break

    case ERROR_CODE.INVALID_LINK_CONFIRM_INVITATION:
      errorDetails = {
        status: 'error',
        title: 'Confirm invitation failed',
        subTitle: error?.response?.data.message,
        extra: <CustomBtn title='Back home' to={PATH.HOME} type='primary' className='!w-[120px]' />
      }
      break

    default:
      errorDetails = {
        status: 'success',
        title: 'Invitation Confirmed!',
        subTitle:
          'Congratulations! You accepted successfully. You can now proceed to extension and enjoy the platform.',
        extra: <CustomBtn title='Go to extension' type='primary' onClick={handleOpenExtension} />
      }
      break
  }

  useEffect(() => {
    if (inviteId) {
      mutateConfirmAccountInvitation(inviteId)
    }
  }, [inviteId])

  return (
    <section className='flex min-h-screen'>
      <div className='m-auto'>{isPending ? <Spin size='large' /> : <Result {...errorDetails} />}</div>
    </section>
  )
}

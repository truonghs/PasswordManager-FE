import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { Result, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/apis'
import { CustomBtn } from '@/components'
import { IDataResponse, IErrorResponse } from '@/interfaces'

export function ConfirmEmail() {
  const { id: userId } = useParams<{ id: string }>()

  const {
    mutate: mutateVerifyEmail,
    isPending,
    isError,
    error
  } = useMutation<IDataResponse, AxiosError<IErrorResponse>, string>({
    mutationFn: authApi.confirmEmail
  })

  useEffect(() => {
    if (userId) {
      mutateVerifyEmail(userId)
    }
  }, [userId])

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      {isPending && <Spin size='large' />}
      {isError ? (
        <Result
          status='error'
          title='Verify email failed'
          subTitle={error?.response?.data.message || 'An error occured'}
          extra={[
            <>
              <CustomBtn title='Back home' to='/' className='!w-[120px]' />
              <CustomBtn title='Register' to='/register' type='primary' className='!w-[120px]' />
            </>
          ]}
        />
      ) : (
        <Result
          status='success'
          title='Verify email successfully'
          subTitle='Please login to use our service'
          extra={[
            <>
              <CustomBtn title='Back home' to='/' type='primary' className='!w-[120px]' />
              <CustomBtn title='Login' to='/login' className='!w-[120px]' />
            </>
          ]}
        />
      )}
    </div>
  )
}

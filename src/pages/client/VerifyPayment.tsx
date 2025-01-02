import { Spin } from 'antd'
import Lottie from 'react-lottie'
import { AxiosError } from 'axios'

import successAnimationData from '@/lotties/Success.json'
import failAnimationData from '@/lotties/Fail.json'
import { useQuery } from '@tanstack/react-query'
import { subscriptionKeys } from '@/keys/subscription.key'
import { IErrorResponse, IVerifySubscriptionStatus } from '@/interfaces'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/utils/constants'

export const VerifyPayment = () => {
  const { data, isLoading, isFetching } = useQuery<IVerifySubscriptionStatus, AxiosError<IErrorResponse>>({
    ...subscriptionKeys.verify(),
    enabled: true
  })
  const navigate = useNavigate()
  const getLottieAnimation = (status: string) => {
    return {
      loop: false,
      autoplay: true,
      animationData: status === 'FAILED' ? failAnimationData : successAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }
  }
  if (data?.status === 'SUCCESS') {
    setTimeout(() => {
      navigate(PATH.VAULT)
    }, 3000)
  }
  return !isLoading && !isFetching ? (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      {data?.status && <Lottie options={getLottieAnimation(data?.status)} height={400} width={400} isStopped={false} />}
      {data?.status === 'FAILED' && (
        <div className='mb-10 delay-75'>
          <div className='text-3xl text-red-600 font-bold uppercase'>{data.message}</div>
          <div className='text-slate-700 text-base'>Xin kiểm tra lại đơn hàng!</div>
        </div>
      )}

      {data?.status === 'SUCCESS' && (
        <div className='mb-10 delay-75'>
          <div className='text-3xl text-green-600 font-bold uppercase'>{data.message}</div>
          <div className='text-slate-700 text-base'>Password Manager xin chân thành cám ơn!</div>
        </div>
      )}
    </div>
  ) : (
    <Spin />
  )
}

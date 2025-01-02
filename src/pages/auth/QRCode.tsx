import { Spin } from 'antd'
import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'

import { authApi } from '@/apis'
import { CustomBtn } from '@/components'
import { IErrorResponse } from '@/interfaces'

export const QRCode: React.FC = () => {
  const {
    data: qrCodeValue,
    isPending,
    refetch,
    isError,
    error
  } = useQuery<string, AxiosError<IErrorResponse>>({
    queryKey: ['qrCode'],
    queryFn: async () => {
      return authApi.getQrCodeValue()
    }
  })

  return (
    <div className='flex items-center justify-center bg-white py-2'>
      {isPending ? (
        <Spin size='large' />
      ) : (
        <div>
          {isError && error.response?.status === 429 && (
            <span className='text-red-500 text-lg py-2'>You don't spam!!!</span>
          )}
          <div className='space-y-4'>
            <div className='flex justify-center'>
              {qrCodeValue && <img src={qrCodeValue} className='shadow-lg rounded-md w-[250px]' />}
            </div>
          </div>
          <CustomBtn type='primary' title='Generate New QR' onClick={refetch} disabled={isError} className='mt-4' />
        </div>
      )}
    </div>
  )
}

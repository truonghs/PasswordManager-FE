import axios, { AxiosResponse } from 'axios'
import type { GetProp, UploadProps } from 'antd'

import { ENVIRONMENT_KEYS } from '@/utils/constants'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const uploadToCloudinary = async (file: FileType): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', ENVIRONMENT_KEYS.VITE_UPLOAD_ASSETS_NAME || '')

  const { data }: AxiosResponse<{ secure_url: string }> = await axios.post<{ secure_url: string }>(
    `${ENVIRONMENT_KEYS.VITE_CLOUDINARY_UPLOAD_URL}/${ENVIRONMENT_KEYS.VITE_CLOUD_NAME}/image/upload/`,
    formData
  )
  return data?.secure_url || ''
}

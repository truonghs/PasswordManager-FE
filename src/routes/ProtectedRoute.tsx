import { Result } from 'antd'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks'
import { CustomLottie } from '@/components'
import loading from '@/lotties/loading.json'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'

type ProtectedRouteProps = {
  role: string
  children: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { currentUser, isPending } = useAuth()

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-screen'>
         <CustomLottie animationData={loading} width={150} height={150} />
      </div>
    )
  }

  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />
  }

  if (currentUser && role !== currentUser?.role) {
    return <Result status='403' title='403' subTitle='Sorry, you are not authorized to access this page.' />
  }
  return <>{children}</>
}

import { message } from 'antd'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authApi } from '@/apis'
import { userKeys } from '@/keys'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants'
import { ICurrentUser, IErrorResponse } from '@/interfaces'

export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn)

  const {
    data: currentUser = null,
    isPending,
    isLoading,
    isFetching,
    isError
  } = useQuery<ICurrentUser>({
    ...userKeys.profile(),
    enabled: !!isLoggedIn
  })

  const { mutate: mutateLogout } = useMutation<void, AxiosError<IErrorResponse>>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      navigate('/')
      queryClient.setQueryData(userKeys.profiles(), null)
      localStorage.removeItem(LOCAL_STORAGE_KEYS.isLoggedIn)
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error(errorMessage)
    }
  })

  return { currentUser, isPending, isLoading, isFetching, mutateLogout, isError }
}

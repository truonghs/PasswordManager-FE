import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ConfigProvider, message, Modal, Pagination, Space, Spin, Typography } from 'antd'

import { accountApi } from '@/apis'
import { accountKeys } from '@/keys'
import { icons } from '@/utils/icons'
import emptyData from '@/lotties/emptyData.json'
import { useAuth, useBoolean, useDebounce } from '@/hooks'
import { AccountItem, CustomBtn, CustomInput, CustomLottie } from '@/components'
import { IAccountDataResponse, IAccountDataResponsePaginate, IErrorResponse, IPaginationParams } from '@/interfaces'

import { CreateAccount } from './CreateAccount'
import { SharingAccount } from './SharingAccount'

export const ListAccounts = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const [queryParams, setQueryParams] = useState<IPaginationParams>()

  const { data, isLoading, isFetching } = useQuery<IAccountDataResponsePaginate, AxiosError<IErrorResponse>>({
    ...accountKeys.list(queryParams as IPaginationParams),
    enabled: !!queryParams
  })

  const [deleteAccountId, setDeleteAccountId] = useState<string>('')

  const [currentAccount, setCurrentAccount] = useState<IAccountDataResponse>()

  const { currentUser } = useAuth()

  const [searchValue, setSearchValue] = useState<string>(searchParams.get('keyword') || '')

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10))

  const debouncedInputValue = useDebounce(searchValue, 600)

  const { value: open, setTrue: setOpen, setFalse: setClose } = useBoolean(false)

  const { value: isShowCreateAccountForm, toggle: toggleShowCreateAccountForm } = useBoolean(false)

  const { value: isShowShareAccount, toggle: toggleShowShareAccount } = useBoolean(false)

  const handleCancel = () => {
    setDeleteAccountId('')
    setClose()
  }

  const handleConfirmDeleteAccount = (accountId: string) => {
    setOpen()
    setDeleteAccountId(accountId)
  }

  const handleConfirmUpdateAccount = (account: IAccountDataResponse) => {
    toggleShowCreateAccountForm()
    setCurrentAccount(account)
  }

  const handleCancelUpdateAccount = () => {
    setCurrentAccount(undefined)
  }

  const handleOpenShareAccount = (account: IAccountDataResponse) => {
    toggleShowShareAccount()
    setCurrentAccount(account)
  }

  const handleDelete = () => {
    if (deleteAccountId) mutateDeleteAccount(deleteAccountId)
  }

  const { mutate: mutateDeleteAccount, isPending: isPendingDeleteAccount } = useMutation({
    mutationFn: accountApi.delete,
    onSuccess: () => {
      message.success('Delete account successfully')
      setClose()
      queryClient.invalidateQueries({ queryKey: accountKeys.lists(), refetchType: 'all' })
    },
    onError: (e) => {
      message.error(e.message)
    }
  })

  const handlePaginationChange = ({ page, limit, keyword }: IPaginationParams) => {
    const newQueryParams = {
      page,
      limit,
      keyword: keyword || debouncedInputValue
    }

    const filteredParams = Object.fromEntries(
      Object.entries(newQueryParams).filter(([, value]) => value !== '' && value !== undefined && value !== null)
    )

    const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString()
    navigate(`?${queryString}`)
    setQueryParams(newQueryParams)
  }

  const handleSearchAccount = (searchValue: string) => {
    setSearchValue(searchValue)
    setCurrentPage(1)
  }

  useEffect(() => {
    const page = currentPage
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const keyword = debouncedInputValue
    const newQueryParams = {
      page,
      limit,
      keyword
    }
    handlePaginationChange(newQueryParams)
  }, [debouncedInputValue])

  return (
    <div className='xs:px-0 md:p-6 overflow-hidden'>
      <CreateAccount
        currentAccount={currentAccount}
        isShowCreateAccountForm={isShowCreateAccountForm}
        handleCancelUpdateAccount={handleCancelUpdateAccount}
        toggleShowCreateAccountForm={toggleShowCreateAccountForm}
      />
      {((!isLoading && data && data?.accounts.length > 0) || searchValue || queryParams?.keyword) && (
        <div className='flex items-center justify-between gap-4 pb-4 xs:flex-col md:flex-row'>
          <div className='w-full flex flex-col items-start gap-4'>
            <CustomInput
              name='searchValue'
              size='large'
              placeholder='Search your accounts'
              className='!h-12 max-w-screen-md xs:mr-0 !text-base font-medium border border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
              onChange={(e: { target: { value: string } }) => handleSearchAccount(e.target.value)}
              value={searchValue}
            />
            <div
              className={`flex items-center ${currentUser?.subscriptionDetail.maxAccounts && currentUser?.subscriptionDetail.maxAccounts !== -1 && data?.accounts && data?.accounts.length >= currentUser?.subscriptionDetail.maxAccounts ? 'text-red-500' : 'text-green-500'}`}
            >
              {data?.accounts.length}/
              {currentUser?.subscriptionDetail.maxAccounts !== -1 ? (
                currentUser?.subscriptionDetail.maxAccounts
              ) : (
                <span className='text-2xl'>&#x221e;</span>
              )}
            </div>
          </div>
          <Space className='flex xs:w-full md:w-auto xs:justify-between'>
            <CustomBtn
              title='Create'
              type='primary'
              className='!mt-0 !w-fit !h-12 !gap-2'
              children={<span className='text-2xl'>{icons.add}</span>}
              onClick={toggleShowCreateAccountForm}
            />
          </Space>
        </div>
      )}
      {isLoading && (
        <div className='flex justify-center items-center mt-5 ab absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
          <Spin size='large' />
        </div>
      )}
      {!isLoading && data && data?.accounts.length > 0 && (
        <>
          <SharingAccount
            currentAccount={currentAccount}
            isShowShareAccount={isShowShareAccount}
            handleCancelUpdateAccount={handleCancelUpdateAccount}
            toggleShowShareAccount={toggleShowShareAccount}
          />
          <Modal
            open={open}
            title='Warning'
            onCancel={handleCancel}
            footer={() => (
              <Space className='flex items-center justify-end gap-x-4'>
                <CustomBtn title='Cancel' onClick={handleCancel} className='border !border-gray-500 !text-slate-800' />
                <CustomBtn
                  title='Delete'
                  type='primary'
                  onClick={handleDelete}
                  loading={isPendingDeleteAccount}
                  className='bg-red-500 hover:!bg-red-600'
                />
              </Space>
            )}
          >
            <span>This item will be permanently removed from your vault.</span>
          </Modal>

          <ul className='grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-8'>
            {data.accounts.map((account: IAccountDataResponse) => (
              <AccountItem
                key={account.id}
                account={account}
                handleOpenShareAccount={handleOpenShareAccount}
                handleConfirmDeleteAccount={handleConfirmDeleteAccount}
                handleConfirmUpdateAccount={handleConfirmUpdateAccount}
              />
            ))}
          </ul>
        </>
      )}
      {!isLoading && !isFetching && data && data?.accounts.length === 0 && (
        <div className='flex flex-col justify-center items-center'>
          <CustomLottie animationData={emptyData} />
          <Typography.Text className='text-center text-lg text-slate-800'>
            {!debouncedInputValue ? "There's no account for you to see yet!" : 'No account found!'}
          </Typography.Text>
          {!debouncedInputValue && (
            <>
              <Typography.Text className='text-center text-lg text-slate-800'>
                If you want to create new account, just click
              </Typography.Text>
              <CustomBtn
                title='Create Account'
                type='primary'
                className='mt-2 !w-fit !h-12 !gap-2'
                children={<span className='text-2xl'>{icons.add}</span>}
                onClick={toggleShowCreateAccountForm}
              />
            </>
          )}
        </div>
      )}
      {data && data.totalPages > 1 && (
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemSize: 40
              }
            }
          }}
        >
          <Pagination
            className='py-6 text-base'
            current={queryParams?.page}
            showSizeChanger={false}
            pageSize={queryParams?.limit}
            total={data.totalPages * data.itemsPerPage}
            onChange={(value) => handlePaginationChange({ page: value, limit: queryParams?.limit || 20 })}
            align='center'
          />
        </ConfigProvider>
      )}
    </div>
  )
}

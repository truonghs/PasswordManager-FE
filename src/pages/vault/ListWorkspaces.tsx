import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ConfigProvider, message, Modal, Pagination, Space, Spin, Typography } from 'antd'

import { workspaceApi } from '@/apis'
import { icons } from '@/utils/icons'
import { workspaceKeys } from '@/keys'
import { useAuth, useBoolean, useDebounce } from '@/hooks'
import emptyData from '@/lotties/emptyWorkspace.json'
import { CustomBtn, CustomInput, CustomLottie, WorkspaceItem } from '@/components'
import { IErrorResponse, IPaginationParams, IWorkspaceDataResponse, IWorkspaceDataResponsePaginate } from '@/interfaces'

import { CreateWorkspace } from './CreateWorkspace'
import { SharingWorkspace } from './SharingWorkspace'

export function ListWorkspaces() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const [queryParams, setQueryParams] = useState<IPaginationParams>()

  const { data, isLoading } = useQuery<IWorkspaceDataResponsePaginate, AxiosError<IErrorResponse>>({
    ...workspaceKeys.list(queryParams as IPaginationParams),
    enabled: !!queryParams
  })
  const { currentUser } = useAuth()

  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string>('')

  const [currentWorkspace, setCurrentWorkspace] = useState<IWorkspaceDataResponse>()

  const [searchValue, setSearchValue] = useState<string>(searchParams.get('keyword') || '')

  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get('page') || '1', 10))

  const debouncedInputValue = useDebounce(searchValue, 600)

  const { value: isOpenWarningDelete, toggle: setOpenWarningDelete } = useBoolean(false)

  const { value: isShowCreateForm, toggle: toggleShowCreateForm } = useBoolean(false)

  const { value: isShowShare, toggle: toggleShowShare } = useBoolean(false)

  const { mutate, isPending: isPendingDeleteWorkspace } = useMutation({
    mutationFn: workspaceApi.softDelete,
    onSuccess: () => {
      message.success('Delete workspace successfully!')
      setOpenWarningDelete()
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
    onError: () => {
      message.error('Delete workspace failed!')
    }
  })

  const handleConfirmDelete = (workspaceId: string) => {
    setOpenWarningDelete()
    setDeleteWorkspaceId(workspaceId)
  }

  const handleConfirmUpdate = (workspace: IWorkspaceDataResponse) => {
    toggleShowCreateForm()
    setCurrentWorkspace(workspace)
  }

  const handleCancel = () => {
    setCurrentWorkspace(undefined)
  }

  const handleOpenShare = (workspace: IWorkspaceDataResponse) => {
    toggleShowShare()
    setCurrentWorkspace(workspace)
  }

  const handleDelete = () => {
    if (deleteWorkspaceId) mutate(deleteWorkspaceId)
  }

  const handleCancelDelete = () => {
    setDeleteWorkspaceId('')
    setOpenWarningDelete()
  }

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

  const handleSearchWorkspace = (searchValue: string) => {
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
      <CreateWorkspace
        currentWorkspace={currentWorkspace}
        isShowCreateForm={isShowCreateForm}
        handleCancel={handleCancel}
        toggleShowCreateForm={toggleShowCreateForm}
      />
      {((!isLoading && data && data?.workspaces.length > 0) || searchValue || queryParams?.keyword) && (
        <div className='flex items-center justify-between gap-4 pb-4 xs:flex-col md:flex-row'>
          <div className='w-full flex flex-col items-start gap-4'>
            <CustomInput
              name='searchValue'
              size='large'
              placeholder='Search your workspaces'
              className='!h-12 max-w-screen-md xs:mr-0 !text-base font-medium border border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom'
              onChange={(e: { target: { value: string } }) => handleSearchWorkspace(e.target.value)}
              value={searchValue}
            />
            <div
              className={`flex items-center ${currentUser?.subscriptionDetail.maxWorkspaces && currentUser?.subscriptionDetail.maxWorkspaces !== -1 && data?.workspaces && data?.workspaces.length >= currentUser?.subscriptionDetail.maxWorkspaces ? 'text-red-500' : 'text-green-500'}`}
            >
              {data?.workspaces.length}/
              {currentUser?.subscriptionDetail.maxWorkspaces !== -1 ? (
                currentUser?.subscriptionDetail.maxWorkspaces
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
              onClick={toggleShowCreateForm}
            />
          </Space>
        </div>
      )}
      {isLoading && (
        <div className='flex justify-center items-center mt-5 ab absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
          <Spin size='large' />
        </div>
      )}
      {!isLoading && data && data?.workspaces.length > 0 && (
        <>
          <SharingWorkspace
            currentWorkspace={currentWorkspace}
            isShowShare={isShowShare}
            handleCancel={handleCancel}
            toggleShowShare={toggleShowShare}
          />
          <Modal
            open={isOpenWarningDelete}
            title='Warning'
            onCancel={handleCancelDelete}
            footer={() => (
              <Space className='flex items-center justify-end gap-x-4'>
                <CustomBtn
                  title='Cancel'
                  onClick={handleCancelDelete}
                  className='border !border-gray-500 !text-slate-800'
                />
                <CustomBtn
                  title='Delete'
                  type='primary'
                  onClick={handleDelete}
                  loading={isPendingDeleteWorkspace}
                  className='bg-red-500 hover:!bg-red-600'
                />
              </Space>
            )}
          >
            <span>This item will be permanently removed from your vault.</span>
          </Modal>

          <ul className='grid md:grid-cols-2 xl:grid-cols-4 gap-8'>
            {data.workspaces.map((workspace: IWorkspaceDataResponse) => {
              return (
                <WorkspaceItem
                  key={workspace.id}
                  workspace={workspace}
                  handleConfirmDelete={handleConfirmDelete}
                  handleConfirmUpdate={handleConfirmUpdate}
                  handleOpenShare={handleOpenShare}
                />
              )
            })}
          </ul>
        </>
      )}

      {!isLoading && data && data?.workspaces.length === 0 && (
        <div className='flex flex-col justify-center items-center'>
          <CustomLottie animationData={emptyData} />
          <Typography.Text className='text-center text-lg text-slate-800'>
            {!debouncedInputValue ? "There's no workspace for you to see yet!" : 'No workspace found!'}
          </Typography.Text>
          {!debouncedInputValue && (
            <>
              <Typography.Text className='text-center text-lg text-slate-800'>
                If you want to create new workspace, just click
              </Typography.Text>
              <CustomBtn
                title='Create Workspace'
                type='primary'
                className='mt-2 !w-fit !h-12 !gap-2'
                children={<span className='text-2xl'>{icons.add}</span>}
                onClick={toggleShowCreateForm}
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

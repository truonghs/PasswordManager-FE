import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import type { GetProp, TableProps } from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import { Button, message, Modal, Pagination, Space, Table } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/apis'
import { userKeys } from '@/keys'
import { IDataResponse, IErrorResponse, IListUsersWithPaginate, IUserInfo } from '@/interfaces'

type ColumnsType<T extends object = object> = TableProps<T>['columns']
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TableParams = {
  pagination?: TablePaginationConfig
  sortField?: SorterResult<IUserInfo>['field']
  sortOrder?: SorterResult<IUserInfo>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export function ManageUsers() {
  const queryClient = useQueryClient()

  const [activeUserId, setActiveUserId] = useState<string>('')

  const [deleteUserId, setDeleteUserId] = useState<string>('')

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 20
    }
  })
  const { current, pageSize } = tableParams.pagination || {}

  const { data } = useQuery<IListUsersWithPaginate, AxiosError<IErrorResponse>>(
    userKeys.list({
      page: current || 1,
      limit: pageSize || 1
    })
  )

  const handleTableChange: TableProps<IUserInfo>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field
    })
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        current: page,
        pageSize
      }
    }))
  }

  const handleCancelDelete = () => {
    setDeleteUserId('')
  }

  const handleCancelActive = () => {
    setActiveUserId('')
  }

  const handleDeactivateUser = async () => {
    mutateDeactivateUser(deleteUserId)
  }

  const { mutate: mutateDeactivateUser, isPending: isPendingDeactivateUser } = useMutation<
    IDataResponse,
    AxiosError<IErrorResponse>,
    string
  >({
    mutationFn: userApi.deactivateUser,
    onSuccess: () => {
      handleCancelDelete()
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      message.success('Deactive user successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Error deactive user: ' + errorMessage)
    }
  })

  const handleActiveUser = async () => {
    mutateActivateUser(activeUserId)
  }

  const { mutate: mutateActivateUser, isPending: isPendingActivateUser } = useMutation<
    IDataResponse,
    AxiosError<IErrorResponse>,
    string
  >({
    mutationFn: userApi.activeUser,
    onSuccess: () => {
      handleCancelActive()
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      message.success('Active user successfully!')
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as IErrorResponse)?.message
      message.error('Error active user: ' + errorMessage)
    }
  })

  const handleConfirmDeactivateUser = (userId: string) => {
    setDeleteUserId(userId)
  }

  const handleConfirmActiveUser = (userId: string) => {
    setActiveUserId(userId)
  }
  const columns: ColumnsType<IUserInfo> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Accounts',
      dataIndex: 'accountscount',
      key: 'accounts'
    },
    {
      title: 'Subscription',

      key: 'subscription',
      render: (_, record) => {
        return <Space size='middle'>{record.subscription ? <div>{record.subscription}</div> : <div>FREE</div>}</Space>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size='middle'>
            {record.deleted ? (
              <Button type='primary' className='bg-primary-500' onClick={() => handleConfirmActiveUser(record.id)}>
                Active
              </Button>
            ) : (
              <Button type='primary' className='bg-gray-500' onClick={() => handleConfirmDeactivateUser(record.id)}>
                Deactivate
              </Button>
            )}
          </Space>
        )
      }
    }
  ]

  useEffect(() => {
    if (data?.totalItems) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: data?.totalItems
        }
      }))
    }
  }, [data])

  return (
    <section className='bg-gray-100'>
      <Modal
        open={!!deleteUserId}
        title='Warning'
        onCancel={handleCancelDelete}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button danger type='primary' onClick={handleDeactivateUser} loading={isPendingDeactivateUser}>
              Deactivate
            </Button>
          </>
        )}
      >
        <span>This user will be deactivated. Are you sure?</span>
      </Modal>
      <Modal
        open={!!activeUserId}
        title='Warning'
        onCancel={handleCancelActive}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button type='primary' onClick={handleActiveUser} loading={isPendingActivateUser}>
              Active
            </Button>
          </>
        )}
      >
        <span>This user will be active. Are you sure?</span>
      </Modal>
      <Table<IUserInfo>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data?.listUsers}
        pagination={false}
        onChange={handleTableChange}
      />

      <Pagination
        className='p-4 text-center bg-white'
        current={tableParams.pagination?.current}
        showQuickJumper
        pageSize={tableParams.pagination?.pageSize}
        total={tableParams.pagination?.total}
        onChange={handlePaginationChange}
      />
    </section>
  )
}

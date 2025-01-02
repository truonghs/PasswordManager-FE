import React from 'react'
import dayjs from 'dayjs'
import Title from 'antd/es/typography/Title'
import { Table, TableProps } from 'antd'

import { icons } from '@/utils/icons'
import { CustomBtn } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { CreateWorkspace } from '@/pages/vault'
import { checkRoleAccess } from '@/utils/helpers'
import { IAccountDataResponse, IWorkspaceDataResponse } from '@/interfaces'

type TableAccountsProps = {
  accounts: IAccountDataResponse[]
  currentWorkspace: IWorkspaceDataResponse
}

export const TableAccounts: React.FC<TableAccountsProps> = ({ accounts, currentWorkspace }) => {
  const { currentUser } = useAuth()

  const { showEdit } = checkRoleAccess(currentUser?.id as string, currentWorkspace)

  const { value: isShowCreateForm, toggle: toggleShowCreateForm } = useBoolean(false)

  const accountColumns: TableProps<IAccountDataResponse>['columns'] = [
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain'
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => dayjs(createdAt).format('MMM D, YYYY')
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => dayjs(updatedAt).format('MMM D, YYYY')
    }
  ]

  return (
    <article>
      <CreateWorkspace
        currentWorkspace={currentWorkspace}
        isShowCreateForm={isShowCreateForm}
        toggleShowCreateForm={toggleShowCreateForm}
      />
      <div className='flex gap-x-2 items-center justify-between mb-4'>
        <Title level={4}>Accounts</Title>
        {showEdit && (
          <CustomBtn
            title='Edit'
            children={<span>{icons.edit}</span>}
            type='primary'
            className='!w-fit'
            onClick={toggleShowCreateForm}
          />
        )}
      </div>
      <Table
        columns={accountColumns}
        dataSource={accounts.map((account) => ({
          key: account.id,
          ...account
        }))}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </article>
  )
}

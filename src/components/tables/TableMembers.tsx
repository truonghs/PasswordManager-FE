import Title from 'antd/es/typography/Title'
import { Avatar, Space, Table, TableProps, Tag } from 'antd'

import { icons } from '@/utils/icons'
import { CustomBtn } from '@/components'
import { useAuth, useBoolean } from '@/hooks'
import { SharingWorkspace } from '@/pages/vault'
import { checkRoleAccess } from '@/utils/helpers'
import anonAvartar from '@/assets/images/anonAvatar.png'
import { IWorkspaceDataResponse, IWorkspaceSharingMemberInfo } from '@/interfaces'

type TableMembersProps = {
  members: IWorkspaceSharingMemberInfo[]
  currentWorkspace: IWorkspaceDataResponse
}

export const TableMembers: React.FC<TableMembersProps> = ({ members, currentWorkspace }) => {
  const { currentUser } = useAuth()

  const { showShare: showAction } = checkRoleAccess(currentUser?.id as string, currentWorkspace)

  const { value: isShowShare, toggle: toggleShowShare } = useBoolean(false)

  const memberColumns: TableProps<IWorkspaceSharingMemberInfo>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: IWorkspaceSharingMemberInfo) => (
        <Space>
          <Avatar src={record.avatar || anonAvartar} />
          {name}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role Access',
      dataIndex: 'roleAccess',
      key: 'roleAccess',
      render: (roleAccess: string) => (
        <Tag
          color={roleAccess === 'MANAGE' ? 'blue' : roleAccess === 'UPDATE' ? 'cyan' : 'green'}
          className='font-medium px-2'
        >
          {roleAccess.toUpperCase()}
        </Tag>
      )
    },
  ]

  return (
    <article className='mt-6'>
      <SharingWorkspace
        currentWorkspace={currentWorkspace}
        isShowShare={isShowShare}
        toggleShowShare={toggleShowShare}
      />
      <div className='flex gap-x-2 items-center justify-between mb-4'>
        <Title level={4}>Members</Title>
        {showAction && (
          <CustomBtn
            title='Edit'
            children={<span>{icons.edit}</span>}
            type='primary'
            className='!w-fit'
            onClick={toggleShowShare}
          />
        )}
      </div>
      <Table
        columns={memberColumns}
        dataSource={members.map((member) => ({
          key: member.id,
          ...member
        }))}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </article>
  )
}

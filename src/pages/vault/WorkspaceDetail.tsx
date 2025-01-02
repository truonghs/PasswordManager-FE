import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Card, Col, Row, Spin, Typography } from 'antd'

import { workspaceKeys } from '@/keys'
import { TableAccounts } from '@/components'
import { TableMembers } from '@/components/tables/TableMembers'
import { IErrorResponse, IWorkspaceDataResponse } from '@/interfaces'

const { Title } = Typography

export const WorkspaceDetail = () => {
  const { workspaceId } = useParams<string>()

  const { data: workspaceData, isLoading } = useQuery<IWorkspaceDataResponse, AxiosError<IErrorResponse>>({
    ...workspaceKeys.detail(workspaceId as string),
    enabled: !!workspaceId
  })

  if (isLoading) {
    return (
      <div className='flex justify-center items-center mt-5 ab absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
        <Spin size='large' />
      </div>
    )
  }

  if (!workspaceData) {
    return <p>No data found!</p>
  }

  return (
    <section className='xs:px-0 md:p-6'>
      <Card className='mb-6'>
        <Row gutter={16} align='middle'>
          <Col span={12} className='text-center'>
            <Avatar size={100} src={workspaceData.owner.avatar} />
            <Title level={4} className='mt-2'>
              Owner: {workspaceData.owner.name}
            </Title>
            <span className='text-base'>{workspaceData.owner.email}</span>
          </Col>

          <Col span={12} className='text-center'>
            <Title level={3}>{workspaceData.name}</Title>
            <span className='text-base'>Created At: {dayjs(workspaceData.createdAt).format('MMM D, YYYY')}</span>
          </Col>
        </Row>
      </Card>

      <TableAccounts accounts={workspaceData.accounts} currentWorkspace={workspaceData} />
      <TableMembers members={workspaceData.members} currentWorkspace={workspaceData} />
    </section>
  )
}

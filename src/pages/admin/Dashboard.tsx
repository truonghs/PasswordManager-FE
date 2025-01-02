import { Card, Col, Row, Statistic } from 'antd'
import { useQueries } from '@tanstack/react-query'

import { dashboardKeys } from '@/keys'
import { AccountDomainChart, UserRegistrationChart } from '@/components'

export function Dashboard() {
  const [quantityUser, quantityAccount, quantityWorkspace] = useQueries({
    queries: [dashboardKeys.quantity('user'), dashboardKeys.quantity('account'), dashboardKeys.quantity('workspace')]
  })

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <Row gutter={16} className='mb-5'>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title='User' value={quantityUser.data} valueStyle={{ color: '#0A2FB6' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title='Account' value={quantityAccount.data} valueStyle={{ color: '#0A2FB6' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic title='Workspace' value={quantityWorkspace.data} valueStyle={{ color: '#0A2FB6' }} />
          </Card>
        </Col>
      </Row>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <UserRegistrationChart />
        <AccountDomainChart />
      </div>
    </div>
  )
}

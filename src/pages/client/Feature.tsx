import { ReactElement } from 'react'
import { Card, Col, Row } from 'antd'
import { Element } from 'react-scroll'
import Title from 'antd/es/typography/Title'

import { LogoCarousel } from '@/components'
import { FEATURES } from '@/utils/constants'

type Feature = {
  title: string
  text: string
  icon: ReactElement
}

export const Feature = () => {
  return (
    <Element name='feature'>
      <section className='py-16 bg-white'>
        <h2 className='text-center text-4xl font-bold'>Why Choose Go Pass Manager?</h2>
        <LogoCarousel />
        <Row gutter={16} justify='center'>
          {FEATURES.slice(0, 3).map((feature: Feature) => (
            <Col xs={24} sm={12} md={8} lg={6} key={feature.title}>
              <Card className='text-center mt-2 px-0 h-full' hoverable>
                <span className='text-3xl text-primary-800'>{feature.icon}</span>
                <Title level={4} className='mt-2'>
                  {feature.title}
                </Title>
                <span className='text-base font-medium'>{feature.text}</span>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={16} justify='center' className='mt-4'>
          {FEATURES.slice(3, 6).map((feature: Feature) => (
            <Col xs={24} sm={12} md={8} lg={6} key={feature.title}>
              <Card className='text-center mt-2 px-0 h-full' hoverable>
                <span className='text-3xl text-primary-800'>{feature.icon}</span>
                <Title level={4} className='mt-2'>
                  {feature.title}
                </Title>
                <span className='text-base font-medium'>{feature.text}</span>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Element>
  )
}

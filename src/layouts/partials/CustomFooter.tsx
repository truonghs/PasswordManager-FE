import { Layout, Row, Col, Typography, Space } from 'antd'

import { SERVICES_LINKS, SOCIAL_MEDIA } from '@/utils/constants'

const { Footer } = Layout
const { Title } = Typography

export const CustomFooter = () => {
  return (
    <Footer className='bg-[#001563] text-white py-6 text-lg font-medium'>
      <div className='container mx-auto px-4'>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} className='mb-10'>
            <div className='flex items-center mb-2'>
              <h2 className='text-2xl font-bold text-white'>GoPass</h2>
            </div>
            <span className='mb-2 text-lg'>Helping you securely store and manage your login information with ease.</span>
            <br />
            <span className='text-lg'>
              GoPass offers a secure solution for user information, allowing you to quickly access accounts without the
              need to remember passwords. Contact us to learn more!
            </span>
            <Title level={4} className='!text-white mt-4'>
              Follow Us
            </Title>
            <Space size='large'>
              {SOCIAL_MEDIA.map((socialMedia) => (
                <span key={socialMedia.href} className='text-2xl'>
                  <a href={socialMedia.href}>{socialMedia.icon}</a>
                </span>
              ))}
            </Space>
          </Col>
          {SERVICES_LINKS.map((serviceInfo) => (
            <Col xs={24} md={6} className='mb-6' key={serviceInfo.title}>
              <h4 className='text-lg font-bold mb-2'>{serviceInfo.title}</h4>
              <ul>
                {serviceInfo.links.map((link) => (
                  <li key={link} className='text-lg'>
                    <a href='#'>{link}</a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
        <div className='border-t border-white pt-4 mt-6'>
          <p className='text-center'>Copyright © Go Pass Manager 2024</p>
        </div>
      </div>
    </Footer>
  )
}

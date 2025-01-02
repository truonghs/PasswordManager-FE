import React from 'react'

import { Outlet } from 'react-router-dom'

import { Layout } from 'antd'

import { SystemHeader } from './admin/Header'

import { Sidebar } from './admin/Sidebar'

const { Content } = Layout

const contentStyle: React.CSSProperties = {
  backgroundColor: '#fafafa',
  overflowY: 'scroll'
}

const layoutStyle = {
  overflow: 'hidden',
  height: '100vh'
}
export function SystemLayout() {
  return (
    <Layout style={layoutStyle}>
      <Sidebar />
      <Layout>
        <SystemHeader />
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

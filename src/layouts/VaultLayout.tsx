import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import React, { useRef,useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/hooks'
import { notificationKeys } from '@/keys'

import { VaultHeader } from './vault/Header'
import { Sidebar } from './vault/Sidebar'
import { ENVIRONMENT_KEYS } from '@/utils/constants'

const { Content } = Layout

const contentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  overflowY: 'auto',
  borderRadius: 12,
  paddingLeft: 16,
  paddingRight: 16
}

const layoutStyle = {
  overflow: 'hidden',
  height: '100vh'
}
export function VaultLayout() {
  const queryClient = useQueryClient()

  const socketRef = useRef<Socket | null>(null)

  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return

    if (!socketRef.current) {
      socketRef.current = io(ENVIRONMENT_KEYS.VITE_SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true
      })

      const socket = socketRef.current
      const userEmail = currentUser.email

      socket.on('connect', () => {
        socket.emit('register', { email: userEmail, socketId: socket.id })
      })

      socket.on('newNotification', () => {
        queryClient.invalidateQueries(notificationKeys.list())
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [currentUser])

  return (
    <Layout style={layoutStyle}>
      <Sidebar />
      <Layout>
        <VaultHeader />
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

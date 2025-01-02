import { Link, useMatches } from 'react-router-dom'
import { Breadcrumb } from 'antd'

type Handle = {
  breadcrumb?: string
  title?: string
}

export function CustomBreadcrumb() {
  const matches = useMatches()

  const breadcrumbItems = matches
    .filter((match) => (match.handle as Handle)?.breadcrumb)
    .map((match) => {
      const { breadcrumb, title } = match.handle as Handle
      const isLast = match.pathname === matches[matches.length - 1].pathname

      return {
        title: breadcrumb,
        path: match.pathname,
        element: isLast ? <span>{title || 'Current'}</span> : <Link to={match.pathname}>{title || 'Default'}</Link>
      }
    })

  return <Breadcrumb items={breadcrumbItems} separator='/' />
}

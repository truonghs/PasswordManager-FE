import dayjs from 'dayjs'

export const formatLocaleTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', { hour12: false })
}

export const formatDateTime = (timestamp: number, formatType: string = 'MM-DD-YYYY') => {
  return dayjs(timestamp).format(formatType)
}

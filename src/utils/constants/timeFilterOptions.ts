import dayjs from 'dayjs'

export const TIME_PER_DAY = 86400000

export const TIME_FILTER_OPTIONS = [
  {
    label: '3 Days',
    value: '3days'
  },
  {
    label: '7 Days',
    value: '7days'
  },
  {
    label: '1 Month',
    value: '1month'
  },
  {
    label: '3 Months',
    value: '3month'
  }
]

export const TIME_FILTER_VALUE = {
  '3days': Date.now() - 3 * TIME_PER_DAY,
  '7days': Date.now() - 7 * TIME_PER_DAY,
  '1month': dayjs().subtract(1, 'month').valueOf(),
  '3month': dayjs().subtract(3, 'month').valueOf()
} as const
export type TimeFilterValue = keyof typeof TIME_FILTER_VALUE

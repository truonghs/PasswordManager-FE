import { Select } from 'antd'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { Bar } from 'react-chartjs-2'
import { useQuery } from '@tanstack/react-query'
import { Chart, registerables, TooltipItem } from 'chart.js'

import { dashboardKeys } from '@/keys'
import { IErrorResponse, IStatisticUsersRegistered } from '@/interfaces'

const { Option } = Select

Chart.register(...registerables)

export function UserRegistrationChart() {
  const [selectedYear, setSelectedYear] = useState(2024)

  const { data: chartDataUsersRegistered } = useQuery<IStatisticUsersRegistered, AxiosError<IErrorResponse>>(
    dashboardKeys.usersRegistered()
  )

  const filteredData = chartDataUsersRegistered?.data.filter((item) => item.year === selectedYear) || []

  const data = {
    labels: filteredData.map((item) => item.month),
    datasets: [
      {
        label: 'Users Registered',
        data: filteredData.map((item) => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
          }
        }
      }
    }
  }

  return (
    <div className='p-4 shadow-lg bg-white rounded-lg'>
      <h3 className='text-lg font-bold mb-2'>User Registrations</h3>
      <div className='flex mb-4'>
        <Select className='mr-2' defaultValue='2024' onChange={(value) => setSelectedYear(Number(value))}>
          {chartDataUsersRegistered?.years?.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>
      <Bar data={data} options={options} />
    </div>
  )
}

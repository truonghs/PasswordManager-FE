import { AxiosError } from 'axios'
import { Pie } from 'react-chartjs-2'
import { useQuery } from '@tanstack/react-query'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js'

import { dashboardKeys } from '@/keys'
import { IErrorResponse, IStatisticAccountOfUser } from '@/interfaces'

ChartJS.register(ArcElement, Tooltip, Legend)

export function AccountDomainChart() {
  const { data: chartDataAccountsOfUsers } = useQuery<IStatisticAccountOfUser[], AxiosError<IErrorResponse>>(
    dashboardKeys.accountsOfUsers()
  )

  const data = {
    labels: chartDataAccountsOfUsers?.map((item) => item.domain) || [],
    datasets: [
      {
        data: chartDataAccountsOfUsers?.map((item) => item.value) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#fa885b', '#FFCE56', '#00cdc7']
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div className='p-4 shadow-lg bg-white rounded-lg'>
      <h3 className='text-lg font-bold mb-2'>Accounts Of Users</h3>
      <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}

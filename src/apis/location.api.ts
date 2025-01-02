
import axios from 'axios'

import { ENVIRONMENT_KEYS } from '@/utils/constants'

export type LocationParams = {
  lat: number
  lon: number
  format: string
}

export const locationApi = {
  getLocationDetail: async (params: LocationParams) => {
    const { data } = await axios.get(`${ENVIRONMENT_KEYS.VITE_OPEN_STREET_MAP_API_URL}`, {
      params
    })
    return data
  }
}

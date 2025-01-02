export interface IStatisticAccountOfUser {
  domain: string
  value: number
}

export interface IStatisticUsersRegistered {
  years: string[]
  data: {
    month: string
    year: number
    value: number
  }[]
}

export type QuantityType = 'user' | 'account' | 'workspace';

import { gql } from '@apollo/client'

export const getAccountBalances = gql`
query AccountBalances($accounts: [String!]) {
  accountBalanceSnapshots(
    orderBy: timestamp,
    orderDirection: desc,
    where: {
      account_in: $accounts
    }
  ) {
    id
    timestamp,
    block,
    amount
    account{
      id
    }
  }
}
`
export const accountBalances = gql`
query AccountBalances($addresses: [String!] = ["0x0000000000000000000000000000000000000000"]) {
    accountBalanceSnapshots(first: 5,
 	 orderBy: timestamp,
  	orderDirection: desc,
    where: {
      account_in: $addresses
    }
  ) {
    id
    timestamp,
    block,
    amount
    account{
      id
    }
  }
}
`

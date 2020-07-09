import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import EmbarkJS from './embarkArtifacts/embarkjs'
import theme from './styles/theme'
import useStyles from './styles/app'
import { SetAccount } from './types'
import Header from './components/Header'

declare global {
  interface Window {
    ethereum: any;
  }
}

function grabAddress(setAccount: SetAccount): void {
  if (window.ethereum) {
    accountListener(setAccount)
    const { selectedAddress: account } = window.ethereum
    if (account) setAccount(account)
  } else {
    console.log('window.ethereum not found :', {window})
  }
}

function accountListener(setAccount: SetAccount): void {
  // Not supported in status. Metamask supported
  try {
    window.ethereum.on('accountsChanged', function (accounts: string[]) {
      const [account] = accounts
      setAccount(account)
    })
  } catch (error) {
    console.error('accountsChanged listener : ', {error})
  }
}

async function enableEthereum(setAccount: SetAccount): Promise<string | undefined> {
  try {
    const accounts = await EmbarkJS.enableEthereum();
    const account = accounts[0]
    setAccount(account)
    // TODO get balances across all relvant tokens
    //this.getAndSetBalances(account)
    return account
  } catch (error) {
    console.error('Enable Ethereum :', {error})
  }
}

function App() {
  const classes: any = useStyles()
  const [account, setAccount] = useState('')
  const [isStatus, setIsStatus] = useState(() => {
    return !!window && !! window.ethereum && !! window.ethereum.status
  })

  useEffect(() => {
    grabAddress(setAccount)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Header
          account={account}
          isStatus={isStatus}
          enableEthereum={() => enableEthereum(setAccount)} />
      </div>
    </ThemeProvider>
  );
}

export default App;

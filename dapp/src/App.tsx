import React, { useState, useEffect } from 'react'
import { Route, Link, Switch, HashRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import EmbarkJS from './embarkArtifacts/embarkjs'
import theme from './styles/theme'
import useStyles from './styles/app'
import { SetAccount } from './types'
import Header from './components/Header'
import CreatePoll from './components/CreatePoll'
import ListPolls from './components/ListPolls'
import Poll from './components/Poll'
import { MessagesProvider } from './context/messages/context'

declare global {
  interface Window {
    ethereum: any;
    messages: object;
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
      <MessagesProvider>
      <div className={classes.root}>
        <Header
          account={account}
          isStatus={isStatus}
          enableEthereum={() => enableEthereum(setAccount)} />
        <Router>
        <Switch>
          <Route path="/(|list-polls)" component={ListPolls} />
          <Route path="/create-poll" component={CreatePoll} />
          <Route path="/poll/:id" component={Poll} />
        </Switch>
        </Router>
      </div>
      </MessagesProvider>
    </ThemeProvider>
  );
}

export default App;

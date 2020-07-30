import React, { useState, useEffect } from 'react'
import { Route, Link, Switch, HashRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './styles/theme'
import useStyles from './styles/app'
import Header from './components/Header'
import CreatePoll from './components/CreatePoll'
import ListPolls from './components/ListPolls'
import Poll from './components/Poll'
import { MessagesProvider } from './context/messages/context'
import { grabAddress, enableEthereum } from './utils/network'

declare global {
  interface Window {
    ethereum: any;
    messages: object;
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

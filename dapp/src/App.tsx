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
import { openBox, openSpace } from './utils/3box'
import { MessagingEnv } from './types'

declare global {
  interface Window {
    ethereum: any;
    messages: object;
    box: any;
    thread: any;
  }
}

const POLLS_DID = "/orbitdb/zdpuAxAuBRQjyzWASBr8khEhUi7AGtLMGsoa4rQpkcV1VmMbe/3box.thread.STATUS-POLLS-FIRING-RANGE1.FIRING-RANGE"
async function initBox(account: string) {
  const box = await openBox(account)
  console.log({box})
  const space = await box.openSpace('STATUS-POLLS-FIRING-RANGE1')
  console.log({space})
  //const thread = await space.joinThread('FIRING-RANGE', {members: false})
  const thread = await space.joinThreadByAddress(POLLS_DID)
  const addy = thread.address
  console.log({addy})
  //const posted = await thread.post('hello world')
  const posts = await thread.getPosts()
  console.log({posts})
  window.box = box
  window.thread = thread
  console.log('process', process.env)
}

function App() {
  const msgType = process.env.REACT_APP_MESSAGING
  const classes: any = useStyles()
  const [account, setAccount] = useState('')
  const [isStatus, setIsStatus] = useState(() => {
    return !!window && !! window.ethereum && !! window.ethereum.status
  })

  useEffect(() => {
     grabAddress(setAccount)
  }, [])

  useEffect(() => {
    if (account && MessagingEnv.BOX === msgType) initBox(account)
  }, [account])

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

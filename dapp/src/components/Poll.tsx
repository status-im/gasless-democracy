import React, { Fragment, useContext, useEffect } from 'react'
import useStyles from '../styles/poll'
import { useParams } from "react-router-dom"
import { MessagesContext } from '../context/messages/context'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { Formik, FormikProps } from 'formik'
import StatusButton from './base/Button'
import { sendToPublicChat } from '../utils/status'
import { prettySign } from '../utils/signing'
import Divider from '@material-ui/core/Divider'
import {
  gotoPublicChat,
  getChatMessages,
  useChatMessages
} from '../utils/status'
import { verifyMessages } from '../utils/messages'
import { Topics, IAccountSnapshotQuery, IBalanceByAddress } from '../types'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getAccountBalances } from '../queries'

const SNT_ROPSTEN_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/bgits/status-snt'

const client = new ApolloClient({
  uri: SNT_ROPSTEN_SUBGRAPH,
  cache: new InMemoryCache()
})

async function gotoPoll(channel: string) {
  await gotoPublicChat(channel)
  getChatMessages()
}

async function verifyEnrichMessages(topics: Topics, rawKey: string, setState: Function) {
  const messages = { [rawKey]: topics[rawKey] }
  const verified = await verifyMessages(messages)
  if (!verified) return
  const enriched = await enrichVotes(verified)
  const merged = { ...topics, ...enriched }
  setState(merged)
}

async function enrichVotes(topics: Topics): Promise<Topics> {
  const keys = Object.keys(topics)
  const accounts: string[] = []
  keys.map(k => {
    const messages = topics[k]
    messages.map(message => {
      const { sigMsg } = message
      if (!sigMsg || !sigMsg.address) return
      // subgraph references all addresses as lowercase
      accounts.push(sigMsg.address.toLowerCase())
    })
  })
  const query = await client.query({
    query: getAccountBalances,
    variables: {
      accounts
    }
  })
  const { data: { accountBalanceSnapshots } } = query
  const balancesByAddress: IBalanceByAddress = {}
  accountBalanceSnapshots.map((res: IAccountSnapshotQuery) => {
    const { account } = res
    balancesByAddress[account.id] = res
  })

  const enrichedTopics: Topics = {}
  keys.map(k => {
    const messages = topics[k]

    enrichedTopics[k] = messages.map(message => {
      const { sigMsg } = message
      if (!sigMsg || !sigMsg.address) return message
      const address = sigMsg.address.toLowerCase()
      const accountSnapshot: IAccountSnapshotQuery = balancesByAddress[address]
      return { ...message, accountSnapshot }
    })
  })
  return enrichedTopics
}

type IBallot = {
  option: string
}

function Poll() {
  const { id } = useParams()
  const topic = `poll-${id}`
  const classes: any = useStyles()
  const [rawMessages] = useChatMessages()
  const messagesContext = useContext(MessagesContext)
  const { chatMessages, dispatchSetTopics } = messagesContext
  useEffect(() => {
    const merged = { ...chatMessages, ...rawMessages }
    if(dispatchSetTopics && rawMessages) verifyEnrichMessages(merged, topic, dispatchSetTopics)
  }, [rawMessages])

  if (!chatMessages) return <Fragment />
  const selectedPoll= chatMessages['polls'].find(p => p.messageId === id)
  if (!selectedPoll || !selectedPoll.pollInfo) return <Fragment />
  const { pollInfo } = selectedPoll
  const { description, title, subtitle, pollOptions } = pollInfo
  const options = pollOptions.split(',')
  // TODO Add method to tabulate votes
  // get all votes, filter by messageId, filter out not verified, grab all addresses, get balances, enrich votes with balances
  console.log({messagesContext, rawMessages})

  return (
    <Formik
      initialValues={{
        option: ''
      }}
      onSubmit={async (values) => {
        const signed = await prettySign(values.option)
        const stringified = JSON.stringify(signed)
        await sendToPublicChat(topic, stringified)
        console.log({values, signed, topic})
      }}
    >
      {({
        values,
        errors,
        handleChange,
        handleSubmit
      }: FormikProps<IBallot>) => {
        return (
          <form className={classes.root} onSubmit={handleSubmit}>
            <Typography className={classes.title}>{title}</Typography>
            <Typography className={classes.subtitle}>{subtitle}</Typography>
            <Typography className={classes.description}>{description}</Typography>
            <TextField
              id="option"
              name="option"
              className={classes.dropDown}
              select
              label="Select"
              value={values.option}
              onChange={handleChange}
              helperText="Select an option"
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <StatusButton
              className={classes.button}
              buttonText="Vote"
              onClick={handleSubmit}
            />
            <Divider className={classes.divider} />
            <StatusButton
              type="button"
              className={classes.button}
              buttonText="Goto room and get poll results"
              onClick={() => gotoPoll(topic)}
            />
          </form>
      )}
      }
    </Formik>
  )
}

export default Poll

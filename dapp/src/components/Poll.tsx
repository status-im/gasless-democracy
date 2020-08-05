import React, { Fragment, useContext, useEffect } from 'react'
import useStyles from '../styles/poll'
import { useParams } from "react-router-dom"
import { MessagesContext } from '../context/messages/context'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
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
import { Topics, IAccountSnapshotQuery, IBalanceByAddress, Message } from '../types'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getAccountBalances } from '../queries'
import RefreshIcon from '@material-ui/icons/Refresh'
import { sum, memoize } from 'lodash'

const mSum = memoize(sum)
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

function tabulateVotes(votes: Message[], ballots: string[]): number[] {
  if (!votes || !ballots) return []
  const votesByIndex: number[] = new Array(ballots.length).fill(0)
  votes.map(vote => {
    const { accountSnapshot, sigMsg } = vote
    if (!accountSnapshot || !sigMsg) return
    const { amount } = accountSnapshot
    const castVote = ballots.findIndex(b => b === sigMsg.msg)
    if (castVote === -1) return
    votesByIndex[castVote] += Number(amount)
  })
  return votesByIndex
}

interface IProgressLabel extends LinearProgressProps {
  ballot: string
}

function LinearProgressWithLabel(props: IProgressLabel) {
  const classes: any = useStyles()
  const { value, ballot } = props
  if (value === undefined || !ballot) return <Fragment />
  return (
    <Box className={classes.progress}>
      <Typography className={classes.progressText}>{ballot}</Typography>
      <Box width="100%" mr={1} className={classes.progressBar}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
type IVoteProgress = {
  ballots: string[],
  tabulated: number[],
  refresh: any
}
function DisplayVoteProgress({ballots, tabulated, refresh}: IVoteProgress) {
  const total = mSum(tabulated)
  const classes: any = useStyles()
  return (
    <Fragment>
      <Typography className={classes.resultText}>Vote results</Typography>
      <RefreshIcon className={classes.refresh} onClick={refresh} />
      {ballots.map((ballot, idx) => {
        const count = tabulated[idx]
        const progress = Math.floor(!count ? 0 : count / total * 100)
        return <LinearProgressWithLabel key={ballot} value={progress} ballot={ballot} />
      })}
    </Fragment>
  )
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
  const selectedPoll= chatMessages['polls'].find(p => p.sigMsg?.msg === id)
  if (!selectedPoll || !selectedPoll.pollInfo) return (<div>poll not found</div>)
  const { pollInfo } = selectedPoll
  const { description, title, subtitle, pollOptions } = pollInfo
  const options: string[] = pollOptions.split(',')
  const votes: Message[] = chatMessages[topic]
  const tabulated: number[] = tabulateVotes(votes, options)
  const tabulatedSum: number = mSum(tabulated)
  console.log({tabulated, votes})

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
            {!tabulatedSum ? <StatusButton
              type="button"
              className={classes.button}
              buttonText="Goto room and get poll results"
              onClick={() => gotoPoll(topic)}
            /> : <DisplayVoteProgress ballots={options} tabulated={tabulated} refresh={() => gotoPoll(topic)} />}
          </form>
      )}
      }
    </Formik>
  )
}

export default Poll

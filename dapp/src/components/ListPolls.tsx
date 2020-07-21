import React, { Fragment, useEffect, useState } from 'react'
import classnames from 'classnames'
import {
  gotoPublicChat,
  getChatMessages,
  useChatMessages
} from '../utils/status'
import { verifySignedMessage } from '../utils/signing'
import { Topics, Message, ISignedMessage, IEnrichedMessage, IPollInfo, IFormattedDate } from '../types'
import Typography from '@material-ui/core/Typography'
import StatusButton from './base/Button'
import useStyles from '../styles/listPolls'
import { getFromIpfs } from '../utils/ipfs'
import { POLLS_CHANNEL } from './constants'
import { getFormattedDate } from '../utils/dates'

async function gotoPolls() {
  await gotoPublicChat(POLLS_CHANNEL)
  getChatMessages()
}

async function enrichMessages(messages: Message[], setState: Function) {
  const updated = messages.map(async (message): Promise<IEnrichedMessage | Message> => {
    const { sigMsg } = message
    if (!message || !sigMsg || !sigMsg.msg) return message
    const res: string = await getFromIpfs(sigMsg.msg)
    try {
      const pollInfo: IPollInfo = JSON.parse(res ? res : sigMsg.msg)
      message.pollInfo = pollInfo
      message.formattedEndDate = getFormattedDate(pollInfo.datePicker)
    } catch(e) {}
    return message
  })
  const resolved = await Promise.all(updated)
  setState(resolved)
}

async function parseMessages(messages: Topics | undefined, setState: Function) {
  if (!messages) return
  const fmtMessages: Topics = {}
  const keys = Object.keys(messages)
  keys.map(key => {
    const msgs: Message[] = messages[key]
    const parsed: Message[] = msgs.map(msg => {
      const { text } = msg;
      const newMsg = { ...msg };
      try {
        const sigMsg: ISignedMessage = JSON.parse(text);
        newMsg['sigMsg'] = sigMsg
      } catch (e) {
        console.log({e})
      } finally {
        if (!!newMsg['sigMsg']) {
          newMsg['verified'] = verifySignedMessage(newMsg['sigMsg'])
        }
        return newMsg
      }
    })
    const verified = parsed.filter(m => m.verified === true)
    fmtMessages[key] = verified
  })
  setState(fmtMessages)
}

interface ITableCard {
  polls: Message[]
}

const isOdd = (num: number): boolean => !!(num % 2)
function TableCards({ polls }: ITableCard) {
  const classes: any = useStyles()
  const { cardText, cellColor } = classes

  return (
    <Fragment>
      {polls.map((poll, i) => {
        const { pollInfo, messageId, formattedEndDate } = poll
        if (!formattedEndDate || !formattedEndDate.plainText) return
        const { plainText } = formattedEndDate
        if (!pollInfo) return
        const { title, description } = pollInfo
        const cellStyling = isOdd(i) ? classnames(cardText) : classnames(cardText, cellColor)
        const lightText = classnames(cellStyling, classes.cardLightText)
        const pollUrl = `/poll/${messageId}`
        return (
          <Fragment key={pollUrl}>
            <Typography className={classnames(cellStyling, classes.cardTitle)}>{title}</Typography>
            <Typography className={classnames(cellStyling, classes.cardSubTitle)}>{description}</Typography>
            <Typography className={lightText}>{plainText}</Typography>
          </Fragment>
        )

      })}
    </Fragment>
  )
}

function ListPolls() {
  const [rawMessages] = useChatMessages()
  const [chatMessages, setChatMessages] = useState()
  const [enrichedPolls, setEnrichedPolls] = useState()
  const classes: any = useStyles()

  useEffect(() => {
    getChatMessages()
  }, [])

  useEffect(() => {
    parseMessages(rawMessages, setChatMessages)
  }, [rawMessages])

  useEffect(() => {
   if (chatMessages) enrichMessages(chatMessages['polls'], setEnrichedPolls)
  }, [chatMessages])

  console.log({chatMessages, rawMessages})
  return (
    <Fragment>
      <div className={classes.root}>
        {!chatMessages && <StatusButton
          buttonText="Goto #polls to get started"
          onClick={gotoPolls}
        />}
        {!!enrichedPolls && <TableCards polls={enrichedPolls} />}
      </div>
    </Fragment>
  )
}

export default ListPolls

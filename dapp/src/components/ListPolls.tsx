import React, { Fragment, useEffect, useState } from 'react'
import {
  gotoPublicChat,
  getChatMessages,
  useChatMessages,
  Topics,
  Message
} from '../utils/status'
import { signedMessage, verifySignedMessage } from '../utils/signing'
import Typography from '@material-ui/core/Typography'
import StatusButton from './base/Button'
import useStyles from '../styles/listPolls'
import { POLLS_CHANNEL } from './constants'

async function gotoPolls() {
  await gotoPublicChat(POLLS_CHANNEL)
  getChatMessages()
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
        const sigMsg: signedMessage = JSON.parse(text);
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
    //const final = resolved.filter((k: Message) => k.text !== NIL)
    console.log({parsed})
    fmtMessages[key] = parsed
  })
  console.log({fmtMessages})
  setState(fmtMessages)
}

function ListPolls() {
  const [rawMessages] = useChatMessages()
  const [chatMessages, setChatMessages] = useState()
  const classes: any = useStyles()

  useEffect(() => {
    getChatMessages()
  }, [])

  useEffect(() => {
    parseMessages(rawMessages, setChatMessages)
  }, [rawMessages])

  //const chatMessages = parseMessages(rawMessages)
  console.log({chatMessages, rawMessages})
  return (
    <Fragment>
      {!chatMessages && <div className={classes.root}>
        <StatusButton
          buttonText="Goto #polls to get started"
          onClick={gotoPolls}
        />
      </div>}
    </Fragment>
  )
}

export default ListPolls

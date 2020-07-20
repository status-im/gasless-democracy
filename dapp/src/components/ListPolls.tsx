import React, { useEffect } from 'react'
import { gotoPublicChat, getChatMessages, useChatMessages } from '../utils/status'

function ListPolls() {
  const chatMessages = useChatMessages()

  useEffect(() => {
    getChatMessages()
  }, [])

  console.log({chatMessages})
  return (
    <div>placeholder</div>
  )
}

export default ListPolls

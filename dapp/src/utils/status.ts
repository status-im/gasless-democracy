import { useState, useEffect } from 'react'
export {}

declare global {
    interface Window {
        ethereum: any;
    }
}

export async function sendToPublicChat(topic: string, message: string | object) {
    try {
        const res = await window.ethereum.status.sendToPublicChat(topic, message)
        return res
    } catch (e) {
        console.error('send to public chat', {e})
    }
}

export async function gotoPublicChat(topic: string) {
    try {
        const res = window.ethereum.status.gotoPublicChat(topic)
        return res
    } catch(e) {
        console.error('send to public chat', {e})
    }
}

export async function getChatMessages(): Promise<any> {
    try {
        const res = window.ethereum.status.getChatMessages()
        console.log({res})
        return res
    } catch(e) {
        console.error('get chat messages', {e})
    }
}

type Message = {
    alias: string,
    text: string,
    timestamp: number,
    from: string,
    messageId: string
}
type Topics = {
    [chat: string]: Message[]
}

type Data = {
    chat: string,
    messages: Message[]
}

interface MessagesEvent extends CustomEvent {
    data: {
        data: Data
    }
}

export function useChatMessages(): Topics | undefined {
    const [chatMessages, setChatMessages] = useState<Topics>()

    function messageHandler(event: MessagesEvent) {
        //TODO check event origin for safety
        const { data } = event.data
        if (!data) return
        const { chat, messages } = data
        setChatMessages((prevState: Topics | undefined) => ({
            ...prevState,
            [chat]: messages
        }))
    }

    useEffect(() => {
        window.addEventListener("message", messageHandler as EventListener)

        return () => {
            window.removeEventListener("message", messageHandler as EventListener)
        }
    })

    return chatMessages

}

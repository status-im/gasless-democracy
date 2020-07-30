import { Topics, Message, ISignedMessage } from '../types'
import { verifySignedMessage } from './signing'

export async function verifyMessages(
    messages: Topics | undefined
): Promise<Topics | undefined> {
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
    return fmtMessages
}

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

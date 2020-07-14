declare var web3: any

type signedMessage = {
    address: string,
    msg: string,
    sig: string,
    version: number
}

export function sign(message: string): Promise<string> {
    return web3.eth.personal.sign(message, web3.eth.defaultAccount)
}

export function verify(message: string, sig: string): Promise<string> {
    return web3.eth.personal.ecRecover(message, sig)
}

export async function verifySignedMessage(message: signedMessage): Promise<boolean> {
    const { address, msg, sig } = message
    const resAddress = await verify(msg, sig)
    return address.toLowerCase() == resAddress.toLowerCase()
}

export async function prettySign(message: string): Promise<signedMessage> {
    const sig = await sign(message)
    return {
        address: web3.eth.defaultAccount,
        msg: message,
        sig,
        version: 2
    };
}

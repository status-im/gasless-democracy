import EthCrypto from 'eth-crypto'
import {
    ecrecover,
    hashPersonalMessage,
    pubToAddress
} from 'ethereumjs-util';

declare var web3: any

export type signedMessage = {
    address: string,
    msg: string,
    sig: string,
    version?: number
}

export function stripHexPrefix(value: string) {
    return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
    return stripHexPrefix(value).toLowerCase();
}

export function sign(message: string): Promise<string> {
    return web3.eth.personal.sign(message, web3.eth.defaultAccount)
}

export function verifySignedMessage({ address, msg, sig, version }: signedMessage) {
    const sigb = new Buffer(stripHexPrefixAndLower(sig), 'hex');
    if (sigb.length !== 65) {
        return false;
    }
    //@todo: explain what's going on here
    sigb[64] = sigb[64] === 0 || sigb[64] === 1 ? sigb[64] + 27 : sigb[64];
    const hash = hashPersonalMessage(new Buffer(msg))
    const pubKey = ecrecover(hash, sigb[64], sigb.slice(0, 32), sigb.slice(32, 64));
    console.log({pubKey})

    return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}

export async function prettySign(message: string): Promise<signedMessage> {
    const sig = await sign(message)
    return {
        address: web3.eth.defaultAccount,
        msg: message,
        sig
    };
}

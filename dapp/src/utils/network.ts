import { Network } from '../types'
declare global {
    interface web3 {
        eth: any;
    }
}

export async function getNetwork(): Promise<Network> {
    // @ts-ignore
    const res = await web3.eth.net.getNetworkType()
    return res
}

export async function setNetwork(setState: Function) {
    const network = await getNetwork()
    setState(network)
}

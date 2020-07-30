import { Network } from '../types'
import EmbarkJS from '../embarkArtifacts/embarkjs'
import { SetAccount } from '../types'

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

export function grabAddress(setAccount: SetAccount): void {
    if (window.ethereum) {
        accountListener(setAccount)
        const { selectedAddress: account } = window.ethereum
        if (account) setAccount(account)
    } else {
        console.log('window.ethereum not found :', {window})
    }
}

function accountListener(setAccount: SetAccount): void {
    // Not supported in status. Metamask supported
    try {
        window.ethereum.on('accountsChanged', function (accounts: string[]) {
            const [account] = accounts
            setAccount(account)
        })
    } catch (error) {
        console.error('accountsChanged listener : ', {error})
    }
}

export async function enableEthereum(setAccount: SetAccount): Promise<string | undefined> {
    try {
        const accounts = await EmbarkJS.enableEthereum();
        const account = accounts[0]
        setAccount(account)
        // TODO get balances across all relvant tokens
        //this.getAndSetBalances(account)
        return account
    } catch (error) {
        console.error('Enable Ethereum :', {error})
    }
}

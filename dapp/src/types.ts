export type SetAccount = (account: string) => any;
export type EnableEthereum = () => Promise<string | undefined>
export type IPollInfo = {
    title: string,
    subtitle: string,
    pollOptions: string,
    datePicker: Date | null,
    description: string,
    network?: Network
}
export enum Network {
    MAINNET = 'main',
    ROPSTEN = 'ropsten'
}

export enum MessagingEnv {
    BOX = 'box',
    WAKU = 'waku'
}

export type ISignedMessage = {
    address: string,
    msg: string,
    sig: string,
    version?: number
}
export type Message = {
    alias: string,
    text: string,
    timestamp: number,
    from: string,
    messageId: string,
    verified?: boolean,
    sigMsg?: ISignedMessage
    pollInfo?: IPollInfo
    formattedEndDate?: IFormattedDate,
    accountSnapshot?: IAccountSnapshotQuery
}
export type Topics = {
    [chat: string]: Message[]
}
export type IFormattedDate = {
    plainText: string,
    daysRemaining: number,
    hoursRemaining: number
}

export type IAccountSnapshotQuery = {
    _typename: "AccountBalanceSnapshot",
    id: string,
    amount: string,
    block: string,
    timestamp: string,
    account: {
        id: string,
        _typename: "Account"
    }
}

export type IBalanceByAddress = {
    [address: string]: IAccountSnapshotQuery
}

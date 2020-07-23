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
    formattedEndDate?: IFormattedDate
}
export type Topics = {
    [chat: string]: Message[]
}
export type IFormattedDate = {
    plainText: string,
    daysRemaining: number,
    hoursRemaining: number
}

// @ts-ignore
import ipfsClient from 'ipfs-http-client'

const ipfsHttpStatus = ipfsClient({ host: 'ipfs.status.im', protocol: 'https', port: '443' })

type file = {
    name: string
    type: string
}

type ipfsFile = {
    path: string
    content: any
}

export const formatForIpfsGateway = (file: file): ipfsFile => {
    const { name } = file
    const content = file
    return {
        path:  `/root/${name}`,
        content
    }
}

const uploadToIpfsRaw = async (str: string) => {
    for await (const result of ipfsHttpStatus.add(str)) {
        return result
    }
}

export const uploadToIpfs = async (str:string): Promise<string> => {
    const res = await uploadToIpfsRaw(str)
    return res.cid.string
}

export const uploadToIpfsGateway = async (files: ipfsFile[]): Promise<string> => {
    const res = await ipfsHttpStatus.add(files)
    return `ipfs/${res.slice(-1)[0].hash}`
}

export const uploadFilesToIpfs = async (
    manifest: string, files: any = {}
): Promise<string> => {
    let fileLists: ipfsFile[] = []
    const formatFn = formatForIpfsGateway
    const uploadFn = uploadToIpfsGateway
    Object.keys(files).forEach(k => {
        fileLists = [...fileLists, formatFn(files[k][0])]
    })
    fileLists.push({
        path: '/root/manifest.json', content: Buffer.from(manifest)
    })
    const res = await uploadFn(fileLists)
    return res
}

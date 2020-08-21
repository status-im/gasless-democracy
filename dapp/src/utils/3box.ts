import Box from '3box';
declare global {
    interface Window {
        ethereum: any;
    }
}

type IBox = {
    openSpace: Function
}

export async function getProfile(id: string) {
    const profile = await Box.getProfile(id)
    return profile
}

// if the user does not have an existing 3Box account, this method will automatically create one for them.
export async function openBox(address: string, provider = window.ethereum) {
    const box = await Box.openBox(address, provider)
    await box.syncDone
    return box
}

export async function openSpace(box: IBox, spaceName: string) {
    const space = await box.openSpace(spaceName)
    await space.syncDone
    return space
}

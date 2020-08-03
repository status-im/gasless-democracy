import DateFnsUtils from '@date-io/date-fns';
import differenceInDays from 'date-fns/differenceInDays'
import differenceInHours from 'date-fns/differenceInHours'
import { IFormattedDate } from '../types'

const dateFns = new DateFnsUtils();
const toDateFn = (date: Date | string | null) => dateFns.date(date)
const today =  dateFns.date(new Date())
const getDateDelta = (date: string) => dateFns.getDiff(toDateFn(date), today)
const daysDiff = (date: number | Date): number => differenceInDays(date, today)
const hoursDiff = (date: number | Date) => differenceInHours(date, today)

export const timeRemaining = (date: Date | string | null): string => {
    const dateStr = toDateFn(date)
    const totalHours = hoursDiff(dateStr)
    const remainder = totalHours % 24
    const days = Math.floor(totalHours / 24)
    const str = totalHours > 0 ? `${days} days and ${remainder} hours until vote ends` : `Vote ended ${Math.abs(days)} days ago`
    return str
}

export const getFormattedDate = (date: Date | string | null): IFormattedDate => {
    const dateNum = toDateFn(date)
    const plainText = timeRemaining(date)
    const daysRemaining = daysDiff(dateNum)
    const hoursRemaining = hoursDiff(dateNum)
    return {
        plainText,
        daysRemaining,
        hoursRemaining
    }
}

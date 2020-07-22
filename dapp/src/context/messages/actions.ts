import { Topics, Message } from '../../types'

export enum types {
    SET_TOPICS = 'SET_TOPICS',
    SET_POLLS = 'SET_POLLS'
}

interface SetTopicsAction {
    type: types.SET_TOPICS,
    payload: Topics
}

interface SetPollsAction {
    type: types.SET_POLLS,
    payload: Message[]
}

export type IAction = SetTopicsAction | SetPollsAction

export function setTopics(topics: Topics): SetTopicsAction {
    return {
        type: types.SET_TOPICS,
        payload: topics
    }
}

export function setPolls(polls: Message[]): SetPollsAction {
    return {
        type: types.SET_POLLS,
        payload: polls
    }
}

import React from "react";
import MessagesReducer from "./reducer";
import { setTopics, setPolls } from "./actions";
import { Topics, Message } from '../../types';

export type IMessagesContext = {
  dispatchSetTopics: Function,
  dispatchSetPolls: Function,
  chatMessages: Topics
}
export const MessagesContext = React.createContext<Partial<IMessagesContext>>({});
export const MessagesConsumer = MessagesContext.Consumer;

export const MessagesProvider = ({ children }: any) => {
  const [chatMessages, dispatch] = React.useReducer(MessagesReducer, {});
  const dispatchSetTopics = (topics: Topics) => dispatch(setTopics(topics));
  const dispatchSetPolls = (polls: Message[]) => dispatch(setPolls(polls));
  const values = { chatMessages, dispatchSetPolls, dispatchSetTopics };
  return (
    <MessagesContext.Provider value={values}>
    {children}
    </MessagesContext.Provider>
  );
};

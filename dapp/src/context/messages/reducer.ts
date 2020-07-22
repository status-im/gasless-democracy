import { types, IAction } from './actions'
import { Topics } from '../../types'

const MessagesReducer = (state: Topics, action: IAction) => {
    switch (action.type) {
        case types.SET_TOPICS:
            return {
                ...state,
                ...action.payload
            };
        case types.SET_POLLS:
            return {
                ...state,
                polls: [ ...action.payload ]
            };
        default:
            return state;
    }
};

export default MessagesReducer;

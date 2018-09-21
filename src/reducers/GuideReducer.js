const INITIAL_STATE = {
	clientList: [],
    currentClient: {},
	clientsKey: '',
	suggestedPrice: '',
	suggestedLocation: '',
	suggestedDescription: '',
	chatTextInput: '',
	suggestionList: [],
	networkStatus: ''
};
import { SAVE_CLIENT_LIST, SAVE_CURRENT_CLIENT, SUGGESTED_DESCRIPTION, SUGGESTED_LOCATION, SUGGESTED_PRICE,
	CHAT_TEXT_CHANGED, SAVE_SUGGESTIONS, SET_NETWORK_STATUS
} from '../actions/types';


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_NETWORK_STATUS:
			return {
				...state,
				networkStatus: action.payload
			}
			break;
		case SAVE_CLIENT_LIST:
			return {
				...state,
				clientList: action.payload
			}
			break;
		case SAVE_SUGGESTIONS:
			return {
				...state,
				suggestionList: action.payload
			}
			break;
		case CHAT_TEXT_CHANGED:
			return {
				...state,
				chatTextInput: action.payload
			}
			break;
        case SAVE_CURRENT_CLIENT:
            return {
                ...state,
                currentClient: action.payload,
				clientsKey: action.clientsKey
            }
            break;
		case SUGGESTED_DESCRIPTION:
			return {
				...state,
				suggestedDescription: action.payload
			}
			break;
		case SUGGESTED_LOCATION:
			return {
				...state,
				suggestedLocation: action.payload
			}
			break;
		case SUGGESTED_PRICE:
			return {
				...state,
				suggestedPrice: action.payload
			}
			break;
		default: 
			return state;
	}
};
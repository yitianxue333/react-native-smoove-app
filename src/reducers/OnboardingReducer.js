
const INITIAL_STATE = {
	fullName: '',
	email: '',
	password: '',
	validatePassword: '',
	userId: '',
	errorText: {text: '', styles: {display:'none'}}
};
import { NAME_CHANGED, EMAIL_CHANGED, PASSWORD_CHANGED, VALIDATE_PASS_CHANGED, ID_SAVED, SHOW_ERROR
} from '../actions/types';


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SHOW_ERROR:
			return {
				...state,
				errorText: action.payload
			}
			break;
		case NAME_CHANGED:
			return {
				...state, 
				fullName: action.payload
			};
			break;
		case EMAIL_CHANGED:
			return {
				...state,
				email: action.payload
			}
			break;
		case PASSWORD_CHANGED:
			return {
				...state,
				password: action.payload
			}
			break;
		case VALIDATE_PASS_CHANGED:
			return {
				...state,
				validatePassword: action.payload,
			}
			break;
		case ID_SAVED:
			return {
				...state,
				userId: action.payload,
				email: action.email
			}
			break;
		default: 
			return state;
	}
};
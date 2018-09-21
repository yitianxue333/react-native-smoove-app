const INITIAL_STATE = {
	currentSelectedPackage: 'Premium',
	currentApartmentPrice: [1700, 5000],
	currentApartmentSelection: 'Studio',
	currentlySelectedCities: [],
	currentlySelectedDays: [],
	currentlySelectedDate: new Date(),
	modalVisible: false,
	paymentModalVisible: false,
	fullName: '',
	email: '',
	firstVisit: true,
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
	stripeToken: '',
	typeOfUser: '',
	guidesName: '',
	dateArrayRaw: [],
	guidesId: '',
	guidesImage: '',
	userStorageLocation: 'user',
	purchasedPrice: 0,
	version: 2,
	cardJustAdded: false,
	profileImage: 'https://firebasestorage.googleapis.com/v0/b/smoove-32fdb.appspot.com/o/signup_placeholderimage.png?alt=media&token=b401414f-fa7a-42ac-9524-24ec2e8c6a43'
};
import { SELECTED_PACKAGE, APARTMENT_PRICE_CHANGED, APARTMENT_SELECTION_CHANGED,
	CITY_CHANGED,
	DAY_CHANGED,
	DATE_CHANGED,
	USER_INFO,
	SHOW_MODAL,
	OLD_PASSWORD_CHANGED,
	CURRENT_PASSWORD_CHANGED,
	CONFIRM_PASSWORD_CHANGED,
	SHOW_PAYMENT_MODAL,
	SAVE_USER_TOKEN_STRIPE,
	UPLOADED_PHOTO,
	RESET_GET_STARTED,
	CHANGE_SELECTED_PACKAGE,
	HIDE_SECOND_PAYMENT,
	FIRST_VISIT_COMPLETE,
	SAVE_RAW_DATES
} from '../actions/types';


export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SAVE_RAW_DATES:
			return {
				...state,
				dateArrayRaw: action.payload
			}
			break;
		case FIRST_VISIT_COMPLETE: 
				return {
					...state,
					firstVisit: false
				}
				break;
		case RESET_GET_STARTED:
			console.log('reset ***********')
				return {
					...state,
					currentSelectedPackage: 'Premium',
					currentApartmentPrice: [1400, 2100],
					currentApartmentSelection: 'Studio',
					currentlySelectedCities: [],
					currentlySelectedDays: [],
					currentlySelectedDate: new Date(),
					modalVisible: false,
					paymentModalVisible: false,
					stripeToken: '',
					typeOfUser: '',
					guidesName: '',
					guidesImage: '',
					userStorageLocation: 'user',
				}
			break;
		case HIDE_SECOND_PAYMENT: 
			return {
				...state,
				cardJustAdded: false
			}
			break;
		case CHANGE_SELECTED_PACKAGE:
			return {
				...state,
				currentSelectedPackage: action.payload
			}
			break;
		case SAVE_USER_TOKEN_STRIPE: 
			return {
				...state,
				stripeToken: action.payload,
				cardJustAdded: true
			}
			break;
		case UPLOADED_PHOTO:
			return {
				...state,
				profileImage: action.payload
			}
			break;
		case SHOW_MODAL:
			return {
				...state,
				modalVisible: action.payload
			}
			break;
		case SHOW_PAYMENT_MODAL:
			return {
				...state,
				paymentModalVisible: action.payload
			}
			break;
		case OLD_PASSWORD_CHANGED: 
			return {
				...state,
				oldPassword: action.payload
			}
			break;
		case CURRENT_PASSWORD_CHANGED:
			return {
				...state,
				newPassword: action.payload
			}
			break;
		case CONFIRM_PASSWORD_CHANGED:
			return {
				...state,
				confirmPassword: action.payload
			}
			break;
		case SELECTED_PACKAGE:
			return {
				...state,
				currentSelectedPackage: action.payload
			}
			break;
		case APARTMENT_PRICE_CHANGED: 
			return {
				...state,
				currentApartmentPrice: action.payload
			}
			break;
		case APARTMENT_SELECTION_CHANGED:
			console.log('Aprtment selection cahnghed')
			return {
				...state,
				currentApartmentSelection: action.payload
			}
			break;
		case CITY_CHANGED:
			return {
				...state,
				currentlySelectedCities: action.payload
			}
			break;
		case DAY_CHANGED:
			return {
				...state,
				currentlySelectedDays: action.payload
			}
			break;
		case DATE_CHANGED:
			return {
				...state,
				currentlySelectedDate: action.payload
			}
			break;
		case USER_INFO:
			console.log(action.payload);
			return {
				...state,
				currentlySelectedDate: action.payload.startDate,
				currentlySelectedDays: action.payload.availability,
				currentlySelectedCities: action.payload.cities,
				currentApartmentSelection: action.payload.apartmentType,
				email: action.payload.email,
				currentApartmentPrice: action.payload.priceRange,
				currentSelectedPackage: action.payload.package,
				profileImage: action.payload.profileImage,
				guidesImage: action.payload.guideImage,
				firstVisit: action.payload.firstVisit,
				guidesId: action.payload.usersGuide,
				guidesName: action.payload.guideName,
				comingFromCompleted: action.payload.comingFromCompleted,
				fullName: action.payload.fullName,
				typeOfUser: action.typeOfUser,
				stripeToken: action.payload.stripeToken,
				userStorageLocation: action.userLocationStorage,
				purchasedPrice: action.payload.purchasedPrice,
				version: action.payload.version,
				dateArrayRaw: action.payload.dateArrayRaw
			}
			break;
		default: 
			return state;
	}
};
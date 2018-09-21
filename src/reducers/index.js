import {combineReducers} from 'redux';
import OnboardingReducer from './OnboardingReducer';
import GetStartedReducer from './GetStartedReducer';
import GuideReducer from './GuideReducer';

export default combineReducers({
	onboarding: OnboardingReducer,
	getStarted: GetStartedReducer,
	guide: GuideReducer
});
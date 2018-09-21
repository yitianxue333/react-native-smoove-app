import React from 'react';
import {Text, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import dismissKeyboard from 'react-native-dismiss-keyboard'
import {Scene, Router, Actions} from 'react-native-router-flux';
import LandingPage from './components/onboarding/LandingPage';
import Onboarding from './components/onboarding/Onboarding';
import SingUpPrompt from './components/onboarding/SingUpPrompt';
import SignUp from './components/onboarding/SignUp';
import Login from './components/onboarding/Login';
import ForgotPass from './components/onboarding/ForgotPass';
import Policies from './components/onboarding/Policies';
import PrepurchaseMain from './components/getStarted/PrepurchaseMain';
import ApartmentPreferences from './components/getStarted/ApartmentPreferences'
import LocationSelector from './components/getStarted/LocationSelector';
import DaySelector from './components/getStarted/DaySelector';
import MainView from './components/main/MainView';
import MainAfterPurchase from './components/main/MainAfterPurchase';
import ProfileNav from './components/profile/ProfileNav';
import AddCard from './components/profile/AddCard'
import ChangePassword from './components/profile/ChangePassword';
import ClientChat from './components/main/ClientChat';
import EditPurchase from './components/main/EditPurchase'
import SuggestList from './components/profile/Suggestions'
import SuggestView from './components/profile/SuggestView'
import Notifications from './components/Notifications'
import TermsOfService from './components/TermsOfService'
import Tutorial from './components/onboarding/Tutorial'
import Mail from './components/Mail'
import PrivacyPolicy from './components/PrivacyPolicy'
renderMainLogo = () => {
    return <Image source={require('./assets/nav_logo.png')}/>
}
hideKeyboardAndPop = () => {
    dismissKeyboard();
    Actions.pop()
}
popAndRefresh = () => {
    Actions.pop();
    setTimeout(() => {
        Actions.refresh();
    }, 10)
}

const animationStyle = (props) => {
    const {layout, position, scene} = props;

    const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';

    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const height = layout.initHeight;

    const opacity = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.3],
        outputRange: [1, 1, 1],
    });

    const scale = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.95],
        outputRange: [1, 1, 1],
    });

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
        case 'horizontal':
            translateX = position.interpolate({
                inputRange,
                //default: outputRange: [width, 0, -10],
                outputRange: [width, 0, 0],
            });
            break;
        case 'vertical':
            translateY = position.interpolate({
                inputRange,
                //default: outputRange: [height, 0, -10],
                outputRange: [height, 0, 0],
            });
            break;
    }

    return {
        opacity,
        transform: [
            {scale},
            {translateX},
            {translateY},
        ],
    };
};


const RouterComponent = () => {

    let logo = require('./assets/nav_bar_logo.png');
    return (
        <Router>
            <Scene
                key="onboardContainer"
                component={Onboarding}
                direction='vertical'
                hideNavBar={true}
                panHandlers={null}
                initial
            />

            <Scene
                key="singUpPrompt"
                component={SingUpPrompt}
                direction='vertical'
                hideNavBar={true}
                panHandlers={null}
            />

            <Scene
                key="signUp"
                component={SignUp}
                title="Sign Up"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
                onBack={() => hideKeyboardAndPop()}
            />
            <Scene
                key="login"
                component={Login}
                title="Login"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
                onBack={() => hideKeyboardAndPop()}
            />
            <Scene
                key="forgotPassword"
                component={ForgotPass}
                title="Forgot Password"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
                onBack={() => hideKeyboardAndPop()}
            />
            <Scene
                key="termsOfService"
                component={TermsOfService}
                title="Terms & Conditions"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
            />
            <Scene
                key="privacyPolicy"
                component={PrivacyPolicy}
                title="Privacy Policy"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
            />

            <Scene
                key="tutorial"
                component={Tutorial}
                navigationBarTitleImage={require('./assets/nav_bar_logo.png')}
                navigationBarTitleImageStyle={{width: 34, height: 34, resizeMode: 'cover', marginTop: -10}}
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)', borderBottomColor: 'transparent'}}
                leftButtonIconStyle={{
                    tintColor: 'white',
                    marginBottom: 10,
                    height: 25,
                    width: 30,
                    resizeMode: 'contain'
                }}
                onBack={() => Actions.profile()}
                backButtonImage={require('./assets/nav_icon_profile.png')}

            />
            <Scene
                key="prepurchase"
                component={PrepurchaseMain}
                hideNavBar={true}
                panHandlers={null}
            />

            <Scene key="getStarted">
                <Scene
                    key="apartmentPreferences"
                    component={ApartmentPreferences}

                    title="Apt. Request"
                    sceneStyle={{paddingTop: 0}}
                    hideNavBar={true}
                    panHandlers={null}
                    navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                    onRight={() => Actions.superAdminChat({typeOfChat: 'super-admin'})}
                    titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                    leftButtonIconStyle={{tintColor: 'white', height: 20, width: 20, resizeMode: 'contain'}}
                    rightButtonIconStyle={{tintColor: 'white', height: 25, width: 25, resizeMode: 'contain'}}
                    onLeft={() => Actions.prepurchase({type: "popAndReplace"})} //if theres a crash this could be the cause
                    onBack={() => Actions.prepurchase({type: "replace"})}
                    leftButtonImage={require('./assets/nav_icon_back@3x.png')}
                    rightButtonImage={require('./assets/icon_chat.png')}
                />
                <Scene
                    key="superAdminChat"
                    component={ClientChat}
                    title="Chat"
                    sceneStyle={{paddingTop: 0}}
                    hideNavBar={true}
                    panHandlers={null}
                    navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)', borderBottomColor: 'transparent'}}
                    titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                    leftButtonIconStyle={{tintColor: 'white', height: 20, width: 20, resizeMode: 'contain'}}
                    onBack={() => hideKeyboardAndPop()}
                    leftButtonImage={require('./assets/nav_icon_back@3x.png')}
                />
            </Scene>
            <Scene
                key="locationSelector"
                component={LocationSelector}
                title="Select City"
                sceneStyle={{paddingTop: 0}}

                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}

            />
            <Scene
                key="daySelector"
                component={DaySelector}
                title="Set Day"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}

            />
            <Scene key="main">
                <Scene
                    key="mainView"
                    component={MainView}
                    navigationBarTitleImage={require('./assets/nav_bar_logo.png')}
                    navigationBarTitleImageStyle={{width: 34, height: 34, resizeMode: 'cover', marginTop: -10}}
                    sceneStyle={{paddingTop: 60}}
                    hideNavBar={true}
                    panHandlers={null}
                    navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                    titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                    leftButtonIconStyle={{
                        tintColor: 'white',
                        height: 25,
                        width: 25,
                        resizeMode: 'contain',
                        position: 'absolute',
                        left: 5
                    }}
                    rightButtonIconStyle={{
                        tintColor: 'white',
                        height: 25,
                        width: 25,
                        resizeMode: 'contain',
                        position: 'absolute',
                        right: 5
                    }}
                    onRight={() => setTimeout(() => {
                        Actions.clientChat({typeOfChat: 'guide'})
                    }, 180)  }
                    onLeft={() => setTimeout(() => {
                        Actions.profile()
                    }, 180)  }
                    leftButtonImage={require('./assets/nav_icon_profile.png')}
                    rightButtonImage={require('./assets/icon_chat.png')}
                />
            </Scene>
            <Scene
                key="notifications"
                component={Notifications}
                sceneStyle={{paddingTop: 0}}
                title="Notifications"
                panHandlers={null}
                hideNavBar={true}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
            />
            <Scene
                key="editRequest"
                component={EditPurchase}
                direction="vertical"
                title="Apt. Request"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)', zIndex: 10}}
                onRight={() => Actions.superAdminChat({typeOfChat: 'super-admin'})}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white', height: 20, width: 20, resizeMode: 'contain'}}
                rightButtonIconStyle={{tintColor: 'white', height: 25, width: 25, resizeMode: 'contain'}}
                onLeft={() => Actions.prepurchase()}
                onRight={() => Actions.clientChat({typeOfChat: 'guide'})}
                leftButtonImage={require('./assets/nav_icon_close.png')}
                rightButtonImage={require('./assets/icon_chat.png')}
                backButtonImage={require('./assets/nav_icon_close.png')}
            />
            <Scene
                key="clientChat"
                component={ClientChat}
                title="Chat"
                sceneStyle={{paddingTop: 0}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)', borderBottomColor: 'transparent'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white', height: 20, width: 20, resizeMode: 'contain'}}
                onLeft={() => hideKeyboardAndPop()}
                onBack={() => hideKeyboardAndPop()}
                leftButtonImage={require('./assets/nav_icon_back@3x.png')}
            />

            <Scene
                key="mainAfterPurchase"
                direction='vertical'
                component={MainAfterPurchase}
                navigationBarTitleImage={require('./assets/nav_bar_logo.png')}
                navigationBarTitleImageStyle={{width: 34, height: 34, resizeMode: 'cover', marginTop: -10}}
                sceneStyle={{paddingTop: 0, backgroundColor: '#3d3d3d'}}
                hideNavBar={true}
                panHandlers={null}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                leftButtonIconStyle={{
                    tintColor: 'white',
                    marginBottom: 18,
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    position: 'absolute',
                    bottom: 10,
                    left: 10
                }}
                rightButtonIconStyle={{tintColor: 'white', height: 25, width: 25, resizeMode: 'contain'}}
                onRight={() => Actions.clientChat({typeOfChat: 'guide'})}
                //onRight = {() => Actions.notifications()}
                onBack={() => Actions.profile()}
                backButtonImage={require('./assets/nav_icon_profile.png')}
                rightButtonImage={require('./assets/icon_chat.png')}
            />
            <Scene key="profile" direction='vertical'>
                <Scene
                    key="profileNav"
                    component={ProfileNav}
                    sceneStyle={{paddingTop: 0}}
                    panHandlers={null}
                    hideNavBar={true}
                    navigationBarStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 9999}}
                    titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                />
                <Scene
                    key="changePassword"
                    component={ChangePassword}
                    sceneStyle={{paddingTop: 0}}
                    panHandlers={null}
                    title="Change Password"
                    hideNavBar={true}
                    navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                    titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                    leftButtonIconStyle={{tintColor: 'white'}}
                    onBack={() => hideKeyboardAndPop()}
                />
            </Scene>
            <Scene
                key="addCard"
                component={AddCard}
                sceneStyle={{paddingTop: 0}}
                panHandlers={null}
                title="Add Credit Card"
                hideNavBar={true}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
            />
            <Scene
                key="suggestList"
                component={SuggestList}
                sceneStyle={{paddingTop: 0}}
                panHandlers={null}
                title="Suggestions"
                hideNavBar={true}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
            />
            <Scene
                key="suggestView"
                component={SuggestView}
                sceneStyle={{paddingTop: 0}}
                panHandlers={null}
                title="Hotel Suggestion"
                hideNavBar={true}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)', borderBottomColor: 'transparent'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
            />
            <Scene
                key="mail"
                component={Mail}
                sceneStyle={{paddingTop: 60}}
                panHandlers={null}
                title="Help & Support"
                hideNavBar={false}
                navigationBarStyle={{backgroundColor: 'rgba(61, 61, 61, 100)'}}
                titleStyle={{color: '#fff', fontFamily: 'PTSans-CaptionBold'}}
                leftButtonIconStyle={{tintColor: 'white'}}
            />
        </Router>
    );

};

export default RouterComponent;
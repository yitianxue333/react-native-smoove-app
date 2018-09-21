import React, {Component, AsyncStorage} from 'react';
import {Image, Text, TouchableOpacity, View, KeyboardAvoidingView, StatusBar, ActivityIndicator, Modal, NetInfo, AlertIOS} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {emailChanged, passwordChanged, saveUserId, saveUserInfo, saveClientList, resetGetStarted, setNetworkStatus} from '../../actions';
import {Input, Button} from '../common';
import LargeButton from '../LargeButton'
import {Header, Icon, Card} from 'react-native-elements'


class SingUpPrompt extends Component {
    componentWillMount() {
        this.state = {
            animating: false
        }
        NetInfo.fetch().done((reach) => {
            //alert('Initial: ' + reach);
        });
        NetInfo.addEventListener(
            'change',
            this.handleFirstConnectivityChange.bind(this)
        );
    }

    componentDidMount() {
        this.setState({
            animating: true
        })

        firebase.auth().onAuthStateChanged((response) => {
            if (response) {
                this.setState({
                    animating: false
                })
                Actions.getStarted();
            } else {
                this.setState({
                    animating: false
                })
                console.log('nobody signed in')
            }
        });
    }

    handleFirstConnectivityChange(reach) {
        this.props.setNetworkStatus(reach)
    }

    checkForNetwork() {
        if (this.props.networkStatus !== 'none') {
            return;
        } else {
            return <Text style = {{color: '#fff', fontSize: 12, fontFamily: 'PTSans-Caption', marginBottom: -30, textAlign: 'center'}}>Network error{'\n'} please regain connection and try again</Text>
        }
    }

    onPressHome() {
        AlertIOS.prompt(
            'Back to Home Screen',
            'Are you sure you want to go back to home screen?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),},
                {text: 'Home', onPress: () => {Actions.onboardContainer({from: 'MAIN_VIEW'})}},
            ],
            'default'
        )
    }

    render() {
        return (
            <Image style = {styles.backgroundImageStyle} source = {require('../../assets/onboarding_background.png')}>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.animating}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <StatusBar
                        backgroundColor="#bebebe"
                        barStyle="light-content"
                    />
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                        <View style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', height: '50%', width: '80%', backgroundColor: 'transparent'}}>
                            {this.checkForNetwork()}
                            <ActivityIndicator
                                size = "large"
                                animating = {this.state.animating}
                                color = "#fff"
                            />
                        </View>
                    </View>
                </Modal>
                <Button textColor = '#fff' onPress={() => Actions.signUp()}>
                    Sign Up
                </Button>
                <Text style = {styles.helperText}>
                    Already have an account?
                </Text>
                <Button textColor = 'rgba(68,149,203,100)' onPress={() => {Actions.login()}}>

                    Login

                </Button>

                <Header
                    backgroundColor="rgba(61,61,61,1)"
                    outerContainerStyles={{borderBottomColor: 'rgba(61,61,61,0)'}}
                    leftComponent={<Icon containerStyle={{width: 24}} name='ios-arrow-back' type="ionicon" color='white' onPress={() => Actions.pop()}/>}
                    centerComponent={
                        <TouchableOpacity onPress={this.onPressHome}>
                            <Image style={{height: 30, width: 30}}
                                   source={require('../../assets/nav_bar_logo.png')}/>
                        </TouchableOpacity>}
                />

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.animating}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                        <View style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', height: '50%', width: '80%', backgroundColor: 'transparent'}}>
                            <ActivityIndicator
                                size = "large"
                                animating = {this.state.animating}
                                color = "#fff"
                            />
                        </View>
                    </View>
                </Modal>

            </Image>
        );
    }
}

const styles = {
    backgroundImageStyle: {
        flex:1,
        flexDirection: 'column',
        alignItems:'center',
        justifyContent:'flex-end',
        width:null,
        height:null,
        resizeMode: 'cover',
        backgroundColor:'rgba(0,0,0,0)',
        paddingBottom: 15
    },
    loginStyle: {
        color: 'rgba(68,149,203,100)',
        fontFamily: 'PTSans-CaptionBold',
        letterSpacing: 2,
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset:  {width: 1, height: 0},
        textShadowRadius: 0.5
    },
    helperText: {
        color: '#fff',
        fontFamily: 'PTSans-Caption',
        letterSpacing: 2,
        margin: 5
    }
};

const mapStateToProps = (state) => {
    return {
        email: state.onboarding.email,
        password: state.onboarding.password,
        errorText: state.onboarding.errorText,
        networkStatus: state.guide.networkStatus
    };
};

export default connect(mapStateToProps,
    {emailChanged, passwordChanged, saveUserId, saveUserInfo, saveClientList, resetGetStarted, setNetworkStatus}
)(SingUpPrompt);
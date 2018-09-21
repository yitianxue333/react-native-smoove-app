import React, {Component, AsyncStorage} from 'react';
import {Image, Text, TouchableOpacity, View, KeyboardAvoidingView, StatusBar, ActivityIndicator, Modal, AlertIOS, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Hr from 'react-native-hr';
import dismissKeyboard from 'react-native-dismiss-keyboard'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {emailChanged, passwordChanged, saveUserId, saveUserInfo, saveClientList, showError} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var width = Dimensions.get('window').width

class Login extends Component {
    componentWillMount() {
        this.state = {
            animating: false
        }
        this.props.emailChanged('');
        this.props.passwordChanged('');
    }
    onEmailChange(text) {
        this.props.emailChanged(text);
    }
    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }
    saveFcmToken(database) {
        var theFCMToken = '';
        FCM.requestPermissions
        FCM.getFCMToken().then(token => {
            theFCMToken = token
            firebase.database().ref('/'+database+'/' + response.uid).update({
                FCMToken: token
            });
            // store fcm token in your server
        });

        FCM.on(FCMEvent.Notification, async (notif) => {
            console.log(notif)

            if(notif.opened_from_tray){
                //app is open/resumed because user clicked banner
                Actions.notifications()
            }
            switch (notif._notificationType) {
                case NotificationType.Remote:
                    notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                    break;
                case NotificationType.NotificationResponse:
                    notif.finish();
                    break;
                case NotificationType.WillPresent:
                    notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
                    break;
            }

        });

        FCM.on(FCMEvent.RefreshToken, token => {
            console.log(token);
        });
    }
    validatePassAndLogin() {
        if (this.props.networkStatus != 'none') {
            this.setState({
                animating: true
            })
            dismissKeyboard()
            let currentProps = this.props;
            let trimmedEmail = currentProps.email;
            trimmedEmail = trimmedEmail.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
            if (!trimmedEmail || trimmedEmail.length <= 0) {
                AlertIOS.alert('Oops', 'Please enter a valid email.')
            } else if (!this.props.password) {
                AlertIOS.alert('Oops', 'Please enter a valid password.')
            } else {
                firebase.auth().signInWithEmailAndPassword(trimmedEmail, this.props.password).then((response) => {

                    this.props.saveUserId(response.uid, response.email, response.type);
                    console.log(response.uid)
                    firebase.database().ref('/user/' + response.uid).once('value').then((snapshot) => {
                        if (snapshot.val() !== null) {
                            this.saveFcmToken('user')
                            this.props.saveUserInfo(snapshot.val(), 'user');
                            console.log(snapshot.val());
                            let data = snapshot.val();
                            this.setState({
                                animating: false
                            })
                            // if (!data.tutorialComplete) {
                            //     Actions.tutorial()
                            // }
                            // else
                                if (data.availability && data.apartmentType && data.cities && data.package && data.priceRange) {
                                Actions.main();
                            } else {
                                Actions.getStarted({buttonText: 'Request Guide'})
                            }

                        } else {
                            firebase.database().ref('/processing/' + response.uid).once('value').then((snapshot) => {
                                if (snapshot.val() !== null) {
                                    this.saveFcmToken('processing')
                                    this.props.saveUserInfo(snapshot.val(), 'processing');
                                    console.log(snapshot.val());

                                    let data = snapshot.val();
                                    this.setState({
                                        animating: false
                                    })
                                    Actions.mainAfterPurchase();
                                } else {
                                    firebase.database().ref('/completed/' + response.uid).once('value').then((snapshot) => {
                                        if (snapshot.val() !== null) {
                                            this.saveFcmToken('/completed')
                                            this.props.saveUserInfo(snapshot.val(), 'processing');
                                            console.log(snapshot.val());
                                            let data = snapshot.val();
                                            firebase.database().ref('/completed/' + response.uid).update({
                                                apartmentType: 'Studio',
                                                type: 'client',
                                                cities: [],
                                                availability: [],
                                                guideName: '',
                                                guideImage: '',
                                                usersGuide: '',
                                                numberOfDeliveries: 0,
                                                comingFromCompleted: true
                                            });
                                            this.setState({
                                                animating: false
                                            })
                                            Actions.getStarted({buttonText: 'Request Guide'})
                                            // Actions.prepurchase();
                                        } else {
                                            this.setState({
                                                animating: false
                                            })
                                            setTimeout(() => {
                                                AlertIOS.alert('Oops', 'Something went wrong. Please try again.')
                                            }, 1000)
                                        }
                                    });
                                }
                            });
                        }
                    });
                })
                    .catch((err) => {
                        this.setState({
                            animating: false
                        })
                        setTimeout(() => {
                            if (err.code == 'auth/wrong-password') {
                                AlertIOS.alert('Oops', 'Wrong password')
                            } else if (err.code == 'auth/user-not-found') {
                                AlertIOS.alert('Oops', "Email not found")
                            } else {
                                AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                            }
                        }, 1000)
                    });
            }
        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }

    }
    hideKeyboardPop() {
        dismissKeyboard()
        Actions.pop()
    }
    checkForContainerHeight() {
        if (width <= 321) {
            return 200
        } else {
            return 300
        }
    }
    render() {

        return (
            <KeyboardAvoidingView behavior = "padding" style = {styles.containerStyle}>
                <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
                    <TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
                        <Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
                    </TouchableOpacity>
                    <Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Login </Text>
                    <TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
                        <View style = {{ height: 25, width: 25}}  />
                    </TouchableOpacity>
                </View>
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
                <StatusBar
                    backgroundColor="#bebebe"
                    barStyle="light-content"
                />
                <View style = {{
                    width: '100%',
                    height: this.checkForContainerHeight(),
                    flex: 0,
                    flexDirection: 'column',
                    alignContent: 'center',
                    justifyContent: 'center'
                }}
                >
                    <View style = {styles.textfieldContainerStyle}>
                        <Input
                            placeholderText = "Email"
                            onChangeText={this.onEmailChange.bind(this)}
                            value = {this.props.email}
                            focus = {true}
                            capitalize = "none"
                            numeric = 'email-address'
                        />
                        <View style = {{height: 0.5, width: '100%', paddingLeft: 4, paddingRight: 4}}>
                            <Hr lineColor = "rgb(190,190,190)" />
                        </View>
                        <Input
                            placeholderText = "Password"
                            onChangeText={this.onPasswordChange.bind(this)}
                            value = {this.props.password}
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity onPress = {() => Actions.forgotPassword()}>
                        <Text style = {styles.helperTextStyle}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>
                <LargeButton onPress={() => this.validatePassAndLogin()}>
                    Login
                </LargeButton>
            </KeyboardAvoidingView>
        );
    }
}

checkForTextfieldHeight = () => {
    if (width <= 321) {
        return 71
    } else {
        return 88.5
    }
}
checkForTextfieldTop = () => {
    if (width <= 321) {
        return 4
    } else {
        return 30
    }
}

const styles = {
    containerStyle: {
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        width:null,
        height:null,
        backgroundColor:'rgb(244,244,244)',
        paddingTop: 65
    },
    textfieldContainerStyle: {
        backgroundColor: '#fff',
        width: '100%',
        height: checkForTextfieldHeight(),
        borderTopWidth: 0.5,
        borderTopColor: 'rgb(190, 190, 190)',
        borderBottomColor: 'rgb(190, 190, 190)',
        borderBottomWidth: 0.5,
        marginTop: checkForTextfieldTop()
    },
    helperTextStyle: {
        color:'rgb(90, 93, 96)',
        fontSize:10,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'PTSans-CaptionBold',
        marginTop: 30
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
    {emailChanged, passwordChanged, saveUserId, saveUserInfo, saveClientList, showError}
)(Login);
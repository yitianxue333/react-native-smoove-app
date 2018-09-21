import React, {Component, AsyncStorage} from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    Modal,
    NetInfo,
    AlertIOS
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {
    emailChanged,
    passwordChanged,
    saveUserId,
    saveUserInfo,
    saveClientList,
    resetGetStarted,
    setNetworkStatus
} from '../../actions';
import {Input, Button} from '../common';
import LargeButton from '../LargeButton'
import {responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {Header, Icon, Card} from 'react-native-elements'

var RNFS = require('react-native-fs')

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height


class Onboarding extends Component {
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

    handleFirstConnectivityChange(reach) {

        this.props.setNetworkStatus(reach)
    }

    componentDidMount() {

        this.setState({
            animating: true
        })
        var path = RNFS.DocumentDirectoryPath + '/tutorial.txt'
        const bool = RNFS.exists(path).then((success) => {
            if (success) {
                if (this.props.from == 'MAIN_VIEW') {
                    this.setState({
                        animating: false
                    })
                } else {
                    firebase.auth().onAuthStateChanged((response) => {

                        FCM.on(FCMEvent.Notification, async (notif) => {
                            console.log(notif)


                            if (notif.opened_from_tray) {
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
                        if (response) {
                            this.props.saveUserId(response.uid, response.email, response.type);
                            firebase.database().ref('/user/' + response.uid).once('value').then((snapshot) => {
                                if (snapshot.val() !== null) {
                                    this.props.saveUserInfo(snapshot.val(), 'user');
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

                                    }
                                    // else {
                                    //     Actions.prepurchase();
                                    // }

                                } else {
                                    firebase.database().ref('/processing/' + response.uid).once('value').then((snapshot) => {
                                        if (snapshot.val() !== null) {
                                            this.props.saveUserInfo(snapshot.val(), 'processing');
                                            let data = snapshot.val();
                                            this.setState({
                                                animating: false
                                            })
                                            Actions.mainAfterPurchase();
                                        } else {
                                            firebase.database().ref('/completed/' + response.uid).once('value').then((snapshot) => {
                                                if (snapshot.val() !== null) {
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
                                                    // Actions.prepurchase();
                                                } else {
                                                    this.setState({
                                                        animating: false
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            this.setState({
                                animating: false
                            })
                            console.log('nobody signed in')
                            // Actions.prepurchase()
                        }
                    });
                }
            } else {
                this.setState({
                    animating: false
                })
                Actions.tutorial()
            }
        }).catch((err) => {
            console.log('error file exist', err.message)
        })

    }

    checkForNetwork() {
        if (this.props.networkStatus !== 'none') {
            return;
        } else {
            return <Text style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'PTSans-Caption',
                marginBottom: -30,
                textAlign: 'center'
            }}>Network error{'\n'} please regain connection and try again</Text>
        }
    }

    handlePressGetStarted() {
        // let database = firebase.database()
        // database.ref('/user/' + this.props.userId).update({
        //     tutorialComplete: true
        // }).then(() => {
        //     Actions.prepurchase()
        // })
        Actions.prepurchase()
    }


    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>

                <Image style={styles.backgroundImageStyle} source={require('../../assets/home.png')}>


                    <TouchableOpacity onPress={() => this.handlePressGetStarted()}>
                        <Image style={styles.gradientButton} source={require('../../assets/get_started_button.png')}/>
                    </TouchableOpacity>

                </Image>

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.animating}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <View style={{
                            flex: 0,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            height: '50%',
                            width: '80%',
                            backgroundColor: 'transparent'
                        }}>
                            <ActivityIndicator
                                size="large"
                                animating={this.state.animating}
                                color="#fff"/>
                        </View>
                    </View>
                </Modal>

                <Icon iconStyle={{width: 40, height: 40}} name='menu' color='#0066CC' style={{position: 'absolute', top: 25, left: 10}}
                      onPress={() => Actions.profile()}/>

            </KeyboardAvoidingView>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'column'
    },
    backgroundImageStyle: {
        width: width,
        height: height,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // justifyContent: 'flex-end',

    },
    gradientBottom: {
        width: width,
        height: responsiveHeight(100),
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    gradientButton: {
        width: responsiveWidth(43),
        height: responsiveHeight(10),
        marginBottom: 15,
    },
    loginStyle: {
        color: 'rgba(68,149,203,100)',
        fontFamily: 'PTSans-CaptionBold',
        letterSpacing: 2,
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: {width: 1, height: 0},
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
        networkStatus: state.guide.networkStatus,
        userId: state.onboarding.userId,
    };
};

export default connect(mapStateToProps,
    {emailChanged, passwordChanged, saveUserId, saveUserInfo, saveClientList, resetGetStarted, setNetworkStatus}
)(Onboarding);
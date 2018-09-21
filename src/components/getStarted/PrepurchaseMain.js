import React, {Component} from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    StatusBar,
    Modal,
    Animated,
    KeyboardAvoidingView,
    Dimensions,
    PixelRatio,
    NetInfo,
    AlertIOS
} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {
    selectSmartPackage,
    selectPremiumPackage,
    apartmentSelectionChanged,
    saveUserId,
    saveUserInfo,
    setNetworkStatus
} from '../../actions';
import {Input} from '../common';
import {responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {Header, Icon, Card} from 'react-native-elements'
import SwipeCards from 'react-native-swipe-cards'
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {SegmentedControls, RadioButtons} from 'react-native-radio-buttons'
import HighlitedButton from '../common/HighlitedButton'

// import Swiper from 'react-native-swiper';
// import Swiper from 'react-native-swiper-animated'
import Swiper from 'react-native-deck-swiper'

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height
var pricingIsHidden = true

const options = ['STUDIO', '1 BEDROOM', '2 BEDROOM']

const DATA = [
    {
        id: 1,
        premium: true,
        size: 'STUDIO',
        noOfApartments: '5 APARTMENTS TO VIEW',
        demoTextNoOfApartments: 'We find 5 apartments that suit you',
        tempAccomodation: 'TEMPORARY ACCOMODATION',
        demoTextTempAccomodation: 'We suggest hotels convenient to your needs',
        sim: 'PRE-PAID SIM',
        demoTextSim: 'We provide a SIM card to stay connected',
        pickup: 'AIRPORT PICKUP/DROP OFF',
        demoTextPickup: 'We meet you at the airport and drive you to your hotel',
        guide: 'GUIDE PICKUP/DROPOFF',
        demoTextGuide: 'We accompany you to apartment visit and drive you back',
        guideFiles: 'ACCESS TO TIPS & TRICKS FOLDER',
        demoTexGuideFiles: `We provide a booklet with local's favorite spots and attractions`,
        tutorial: 'Risk Free: No payment needed now. Lock in this great price!*',
        cancellation: '*(see cancellation policy for details)',
        orignalPrice: '$599',
        price: '$499',
        icon: require('../../assets/icon_premiumpackage.png'),
    },
    // {
    //     id: 2,
    //     premium: true,
    //     size: '1 BEDROOM',
    //     noOfApartments: '5 APARTMENTS TO VIEW',
    //     sim: 'PRE-PAID SIM',
    //     pickup: 'LAX PICKUP AND DROP OFF',
    //     guide: 'GUIDE PICKUP/DROPOFF',
    //     guideFiles: 'ACCESS TO LOCAL GUIDELINES',
    //     tutorial: 'RECOMENDED TO BOOK IN ADVANCE AS EARLY AS POSSIBLE TO AVOID .....',
    //     demoText: 'WE WILL SHOW YOU FIVE APARTMENTS IN LOS ANGELES, ETC',
    //     orignalPrice: '$649',
    //     price: '$549',
    //     icon: require('../../assets/icon_premiumpackage.png'),
    // }, {
    //     id: 3,
    //     premium: true,
    //     size: '2 BEDROOM',
    //     noOfApartments: '5 APARTMENTS TO VIEW',
    //     sim: 'PRE-PAID SIM',
    //     pickup: 'LAX PICKUP AND DROP OFF',
    //     guide: 'GUIDE PICKUP/DROPOFF',
    //     guideFiles: 'ACCESS TO LOCAL GUIDELINES',
    //     tutorial: 'RECOMENDED TO BOOK IN ADVANCE AS EARLY AS POSSIBLE TO AVOID .....',
    //     demoText: 'WE WILL SHOW YOU FIVE APARTMENTS IN LOS ANGELES, ETC',
    //     orignalPrice: '$699',
    //     price: '$599',
    //     icon: require('../../assets/icon_premiumpackage.png'),
    // },
    {
        id: 4,
        premium: false,
        size: '1 BEDROOM',
        noOfApartments: '3 APARTMENTS TO VIEW',
        demoTextNoOfApartments: 'We find 5 apartments that suit you',
        tempAccomodation: 'TEMPORARY ACCOMODATION',
        demoTextTempAccomodation: 'We suggest hotels convenient to your needs',
        sim: 'PRE-PAID SIM',
        demoTextSim: 'We provide a SIM card to stay connected',
        pickup: 'AIRPORT PICKUP/DROP OFF',
        demoTextPickup: 'We meet you at the airport and drive you to your hotel',
        guide: 'GUIDE PICKUP/DROPOFF',
        demoTextGuide: 'We accompany you to apartment visit and drive you back',
        guideFiles: 'ACCESS TO TIPS & TRICKS FOLDER',
        demoTexGuideFiles: `We provide a booklet with local's favorite spots and attractions`,
        tutorial: 'Risk Free: No payment needed now. Lock in this great price!*',
        cancellation: '*(see cancellation policy for details)',
        orignalPrice: '$349',
        price: '$249',
        icon: require('../../assets/icon_smartpack.png'),
    },
    // {
    //     id: 5,
    //     premium: false,
    //     size: '2 BEDROOM',
    //     noOfApartments: '3 APARTMENTS TO VIEW',
    //     sim: null,
    //     pickup: null,
    //     guide: 'GUIDE PICKUP/DROPOFF',
    //     guideFiles: 'ACCESS TO LOCAL GUIDELINES',
    //     tutorial: 'RECOMENDED TO BOOK IN ADVANCE AS EARLY AS POSSIBLE TO AVOID .....',
    //     demoText: 'WE WILL SHOW YOU FIVE APARTMENTS IN LOS ANGELES, ETC',
    //     orignalPrice: '$449',
    //     price: '$349',
    //     icon: require('../../assets/icon_smartpack.png'),
    // }, {
    //     id: 6,
    //     premium: false,
    //     size: 'STUDIO',
    //     noOfApartments: '3 APARTMENTS TO VIEW',
    //     sim: null,
    //     pickup: null,
    //     guide: 'GUIDE PICKUP/DROPOFF',
    //     guideFiles: 'ACCESS TO LOCAL GUIDELINES',
    //     tutorial: 'RECOMENDED TO BOOK IN ADVANCE AS EARLY AS POSSIBLE TO AVOID .....',
    //     demoText: 'WE WILL SHOW YOU FIVE APARTMENTS IN LOS ANGELES, ETC',
    //     orignalPrice: '$299',
    //     price: '$199',
    //     icon: require('../../assets/icon_smartpack.png'),
    // },
];

class PrepurchaseMain extends Component {
    constructor(props) {
        super(props);
        this.onSwipeRight = this.onSwipeRight.bind(this)
        this.onSwipeLeft = this.onSwipeLeft.bind(this)
        this.renderCard = this.renderCard.bind(this)
        this.onPressSelect = this.onPressSelect.bind(this)
        this.state = {
            selectedSegment: 0
        }
    }

    componentWillMount() {
        console.log("current seleted package1 ", this.props.currentSelectedPackage)
        this.state = {
            currentlyDisplaying: 'Smart',
            bounceValueThree: new Animated.Value(500),
            showPricing: false,
        }
        firebase.database().ref('/user/' + this.props.userId).once('value', (snapshot) => {
            if (snapshot.val()) {
                this.props.saveUserInfo(snapshot.val(), 'user');
            }
        })
        this.props.selectPremiumPackage()
        this.props.apartmentSelectionChanged('Studio')
    }

    componentDidMount() {
        this.props.selectPremiumPackage()
        this.props.apartmentSelectionChanged('Studio')
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    // handlePriceSelection(selectedOption) {
    //     this.props.apartmentSelectionChanged(selectedOption)
    //     this.onPressSelect()
    // }

    renderCard(card, i) {
        let cardImage = require('../../assets/premium_card.png')
        if (!card.premium) {
            cardImage = require('../../assets/smart_card.png')
        }
        return (
            <View key={i} style={styles.cardContainer}>
                <Image style={styles.styleImage} source={cardImage}>
                    <View style={styles.buttonsContainer}>
                        <HighlitedButton premium={card.premium}/>
                    </View>
                </Image>
            </View>
        )
    }

    onPressSelect() {
        console.log('onPressSelect')
        let currentPackage = this.props.currentSelectedPackage
        // if (!currentPackage) {
        //     currentPackage = 'Smart'
        // }
        if (this.props.networkStatus != 'none') {
            let database = firebase.database();
            database.ref('/user/' + this.props.userId).update({
                package: currentPackage
            })
            setTimeout(() => {
                // Actions.getStarted({buttonText: 'Request Guide'})
                Actions.singUpPrompt()
            }, 160)
        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }

    }

    onSwipeRight(ind) {
        if (ind == 0) {
            console.log('selected smart')
            this.props.selectSmartPackage()
            // this.props.apartmentSelectionChanged('1 Bedroom')
        } else if (ind == 1) {
            console.log('selected premium')
            this.props.selectPremiumPackage()
            // this.props.apartmentSelectionChanged('2 Bedroom')
        }
        // else if (ind == 2) {
        //     this.props.selectSmartPackage()
        //     this.props.apartmentSelectionChanged('1 Bedroom')
        // } else if (ind == 3) {
        //     this.props.selectSmartPackage()
        //     this.props.apartmentSelectionChanged('2 Bedroom')
        // } else if (ind == 4) {
        //     this.props.selectSmartPackage()
        //     this.props.apartmentSelectionChanged('Studio')
        // } else if (ind == 5) {
        //     this.props.selectPremiumPackage()
        //     this.props.apartmentSelectionChanged('Studio')
        // }
    }

    onSwipeLeft(ind) {
        if (ind == 0) {
            console.log('selected smart')
            this.props.selectSmartPackage()
            // this.props.apartmentSelectionChanged('Studio')
        } else if (ind == 1) {
            console.log('selected premium')
            this.props.selectPremiumPackage()
            // this.props.apartmentSelectionChanged('Studio')
        }
        // else if (ind == 2) {
        //     this.props.selectPremiumPackage()
        //     this.props.apartmentSelectionChanged('1 Bedroom')
        // } else if (ind == 3) {
        //     this.props.selectPremiumPackage()
        //     this.props.apartmentSelectionChanged('2 Bedroom')
        // } else if (ind == 4) {
        //     this.props.selectSmartPackage()
        //     this.props.apartmentSelectionChanged('1 Bedroom')
        // } else if (ind == 5) {
        //     this.props.selectSmartPackage()
        //     this.props.apartmentSelectionChanged('2 Bedroom')
        // }
    }

    onPressHome() {
        AlertIOS.prompt(
            'Back to Home Screen',
            'Are you sure you want to go back to home screen?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),},
                {text: 'Home', onPress: () => {Actions.pop()}},
            ],
            'default'
        )
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
                <Image style={styles.backgroundImageStyle} source={require('../../assets/background_card_screen.jpg')}>

                    <Text style={styles.textChoosePackage}>CHOOSE YOUR PACKAGE</Text>
                    <View style={styles.containerBackgroundCard}>
                        <Image resizeMode='cover' style={styles.backgroundCards}
                               source={require('../../assets/background_card.png')}>
                            <Swiper
                                cards={DATA}
                                renderCard={this.renderCard}
                                cardIndex={0}
                                cardVerticalMargin={0}
                                infinite={true}
                                // cardHorizontalMargin={0}
                                backgroundColor={'rgba(0,0,0,0)'}
                                goBackToPreviousCardOnSwipeLeft={true}
                                showSecondCard={true}
                                // onSwiped={this.onIndexChanged}
                                onSwipedLeft={this.onSwipeLeft}
                                onSwipedRight={this.onSwipeRight}
                            />
                        </Image>
                    </View>

                    <TouchableOpacity style={styles.selectButtonContainer} onPress={this.onPressSelect}>
                        <Image style={styles.gradientButton} source={require('../../assets/select_button.png')}/>
                    </TouchableOpacity>

                </Image>

                <Header
                    backgroundColor="rgba(61,61,61,0.2)"
                    outerContainerStyles={{borderBottomColor: 'rgba(61,61,61,0)'}}
                    leftComponent={<Icon iconStyle={{width: 30, height: 30, marginTop: 15}} name='menu' color='white' onPress={() => Actions.profile()}/>}
                    centerComponent={
                        <TouchableOpacity onPress={this.onPressHome}>
                            <Image style={{height: 30, width: 30, marginRight: 10}}
                                   source={require('../../assets/nav_bar_logo.png')}/>
                        </TouchableOpacity>}
                    rightComponent={<Icon containerStyle={{width: 30}} name='md-arrow-back' type="ionicon" color='white' iconStyle={{marginTop: 15}}
                                          onPress={() => Actions.pop()}/>}
                />
            </KeyboardAvoidingView>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // paddingTop: 65
    },
    backgroundImageStyle: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundCards: {
        // width: responsiveWidth(80),
        // height: responsiveHeight(73),
        height: undefined, width: undefined, flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 55,
    },
    gradientButton: {
        width: 140,
        height: 40,
    },
    selectButtonContainer: {
        // position: 'absolute',
        // bottom: 0,
    },
    cardContainer: {
        width: responsiveWidth(75),
        height: responsiveHeight(67),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // padding: 2,
        marginTop: responsiveHeight(3),
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    containerBackgroundCard: {
        width: responsiveWidth(100),
        height: responsiveHeight(73),
        // backgroundColor: 'red',
        marginTop: 5,
        flexWrap: 'wrap',
    },
    textChoosePackage: {
        marginTop: 65,
        fontSize: 18,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    swipeCards: {
        width: responsiveWidth(75),
        height: responsiveHeight(67),
        justifyContent: 'center',
        alignSelf: 'center',
        // backgroundColor: 'rgba(0,0,0,0)'
    },
    styleImage: {
        width: responsiveWidth(100),
        height: responsiveHeight(100),
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'flex-end'
        // marginTop: -10
    },
    heading: {
        flexDirection: 'column',
        marginTop: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerHeading: {
        flexDirection: 'row'
    },
    cancellationText: {
        flexDirection: 'row'
    },
    priceButtons: {
        // backgroundColor: 'rgba(255,255,51, 0.5)',
        width: responsiveWidth(18),
        height: responsiveHeight(8),
        // marginLeft: 2
    },
    buttonsContainer: {
        // backgroundColor: 'rgba(255,51,51, 0.5)',
        flexDirection: 'row',
        width: responsiveWidth(69),
        height: responsiveHeight(8),
        marginBottom: responsiveHeight(23.9),
        justifyContent: 'space-around',
        marginLeft: responsiveHeight(0)
    },
};

const mapStateToProps = (state) => {
    return {
        currentSelectedPackage: state.getStarted.currentSelectedPackage,
        userId: state.onboarding.userId,
        networkStatus: state.guide.networkStatus,
        email: state.onboarding.email,
        password: state.onboarding.password,
        errorText: state.onboarding.errorText,
    };
};
export default connect(mapStateToProps,
    {selectPremiumPackage, selectSmartPackage, apartmentSelectionChanged, saveUserId, saveUserInfo, setNetworkStatus}
)(PrepurchaseMain);


{/*<Text style={{*/
}
{/*fontSize: fontSizeOrigPrice,*/
}
{/*marginTop: 20,*/
}
{/*textDecorationLine: 'line-through',*/
}
{/*color: 'red'*/
}
{/*}}>{card.orignalPrice}</Text>*/
}
{/*<Text style={{fontSize: fontSizeDiscPrice, marginTop: 3}}>{card.price}</Text>*/
}
{/*<Text style={{*/
}
{/*fontSize: fontSizeTutorial,*/
}
{/*marginTop: 5,*/
}
{/*alignSelf: 'center',*/
}
{/*textAlign: 'center'*/
}
{/*}}>{card.tutorial}</Text>*/
}
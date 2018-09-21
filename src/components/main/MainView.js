import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Slider,
    Animated,
    Image,
    DatePickerIOS,
    Modal,
    TouchableHighlight,
    StatusBar,
    AlertIOS,
    Dimensions
} from 'react-native';
import {SegmentedControls} from 'react-native-radio-buttons'
import {connect} from 'react-redux';
import axios from 'axios';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {
    showModal,
    selectPremiumPackage,
    selectSmartPackage,
    showPaymentModal,
    hideSecondPaymentModal
} from '../../actions';
import moment from 'moment';
import {Input} from '../common';
import LargeButton from '../LargeButton'
import {Header, Icon, Card} from 'react-native-elements'

var packageIsHidden = true
var pricingIsHidden = true
var width = Dimensions.get('window').width

class MainView extends Component {
    componentWillMount() {
        this.state = {
            currentPrice: null,
            purchasedModal: false,
            bounceValueTwo: new Animated.Value(500),
            bounceValueThree: new Animated.Value(500),
            showRequirements: false,
            showChangePackage: false,
            showPricing: false,
            warningTimeModal: false
        }
    }

    setModalVisible(visible) {
        if (this.props.stripeToken) {
            this.props.showModal(visible);
        } else {
            this.showPaymentModal(true);
        }
    }

    showRequirements() {
        if (this.props.networkStatus != 'none') {
            if (this.state.showChangePackage === false && packageIsHidden === true) {
                this.setState({showRequirements: true})
                this.toggleSubviewTwo()
            }
        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }
    }

    hideRequirements() {
        if (packageIsHidden === false) {
            this.toggleSubviewTwo()
            setTimeout(() => {
                this.setState({
                    showRequirements: false
                })
            }, 300)
        }
    }

    toggleSubviewTwo() {

        var toValue = 500;

        if (packageIsHidden) {
            toValue = 0;
        }
        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValueTwo,
            {
                toValue: toValue,
                velocity: 7,
                tension: 2,
                friction: 4,
            }
        ).start();
        packageIsHidden = !packageIsHidden;
    }

    toggleSubviewThree() {

        var toValue = 500;

        if (pricingIsHidden) {
            toValue = 0;
        }
        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValueThree,
            {
                toValue: toValue,
                velocity: 7,
                tension: 2,
                friction: 4,
            }
        ).start();
        pricingIsHidden = !pricingIsHidden;
    }

    mapVersion2Cities(cities) {
        return cities.map((city, i) => {
            // console.log(city)
            return <Text key={i} style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                width: width
            }}>
                • {' ' + city}
            </Text>
        })

    }

    getTopLocationMargin() {
        let cityArray = this.props.currentlySelectedCities;
        let theLength = cityArray.length
        return (theLength * 10) - 10
    }

    version2Cities(cities) {
        return <View style={{
            flex: 0,
            flexDirection: 'column',
            marginLeft: 90,
            width: width,
            height: '100%',
            justifyContent: 'center',
            marginTop: this.getTopLocationMargin()
        }}>
            {this.mapVersion2Cities(cities)}
        </View>
    }

    checkForCities() {
        let cityArray = this.props.currentlySelectedCities;
        if (cityArray) {
            if (cityArray.length > 1) {
                if (this.props.version && this.props.version > 1) {
                    return this.version2Cities(cityArray)
                } else {
                    let cityArrayString = ''
                    for (let i = 0, theLength = cityArray.length; i < theLength; i++) {
                        cityArrayString = cityArrayString + cityArray[i] + ',' + ' '
                    }
                    let theLength = cityArrayString.length
                    cityArrayString = cityArrayString.substring(0, theLength - 2)
                    return cityArrayString
                }
            } else {
                if (this.props.version && this.props.version > 1) {
                    return this.version2Cities(cityArray)
                } else {
                    return cityArray[0]
                }

            }
        }
    }

    checkForTimeBracket(time) {
        // console.log(time)
        if (time == 'morning') {
            return '9am - 1pm'
        } else if (time == 'afternoon') {
            return '1pm - 5pm'
        } else {
            return 'AM or PM'
        }
    }

    version2Days(days) {
        return <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: width,
            height: '100%'
        }}>
            <Text style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                marginLeft: 180,
                width: '100%'
            }}>
                {this.formatDate(days[0])}
            </Text>
            <Text style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                marginLeft: 180,
                width: '100%'
            }}>
                {this.formatDate(days[1])}
            </Text>
            <Text style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                marginLeft: 180,
                width: '100%'
            }}>
                {this.formatDate(days[2])}
            </Text>
            <Text style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                marginLeft: 180,
                width: '100%'
            }}>
                {this.formatDate(days[3])}
            </Text>
            <Text style={{
                fontFamily: 'PTSans-CaptionBold',
                fontSize: this.checkForSmallScreenText(),
                color: '(rgb(61,61,61)',
                textAlign: 'left',
                marginLeft: 180,
                width: '100%'
            }}>
                {this.formatDate(days[4])}
            </Text>
        </View>
    }

    formatDate(date) {
        if (date && date.date) {
            let formattedDate = '•' + ' ' + (moment(date.date).format('MMMM Do')) + ' ' + '|' + ' ' + this.checkForTimeBracket(date.timeSlot);
            return formattedDate
        }
    }

    checkForDays() {
        // console.log(this.props.version)
        let dayArray = this.props.currentlySelectedDays;
        // console.log(this.props.currentlySelectedDays)
        if (dayArray && dayArray.length > 0) {
            if (dayArray.length > 1) {
                let dayArrayString = ''
                for (let i = 0, theLength = dayArray.length; i < theLength; i++) {
                    if (this.props.version && this.props.version > 1) {
                        return this.version2Days(dayArray)
                        //dayArrayString = dayArrayString + this.checkForDate(dayArray[i].date) + ' ' + this.checkForTimeBracket(dayArray[i].timeSlot) +',' + ' '
                    } else {
                        dayArrayString = dayArrayString + this.checkForDate(dayArray[i].dayOfWeek) + ' ' + this.checkForTimeBracket(dayArray[i].time) + ',' + ' '
                    }
                }
                let theLength = dayArrayString.length
                dayArrayString = dayArrayString.substring(0, theLength - 2)
                return dayArrayString
            } else {
                if (this.props.version && this.props.version > 1) {
                    return this.version2Days(dayArray)
                } else {
                    return dayArray[0].dayOfWeek + ' ' + this.checkForTimeBracket(dayArray[0].time)
                }
            }
        }
    }

    checkForEmailDays() {
        // console.log(this.props.version)
        let dayArray = this.props.currentlySelectedDays;

        if (dayArray && dayArray.length > 0) {
            if (dayArray.length > 1) {
                let dayArrayString = ''
                for (let i = 0, theLength = dayArray.length; i < theLength; i++) {
                    // console.log(dayArray[i])
                    dayArrayString += this.checkForDate(dayArray[i].date) + ' ' + this.checkForTimeBracket(dayArray[i].timeSlot) + ' ' + '•' + ' '
                    // console.log(dayArrayString)
                }
                // console.log(dayArrayString)
                let theLength = dayArrayString.length
                dayArrayString = dayArrayString.substring(0, theLength - 2)
                return dayArrayString
            } else {
                return '•' + ' ' + this.checkForDate(dayArray[0].date) + ' ' + this.checkForTimeBracket(dayArray[0].timeSlot)
            }
        }
    }

    showPaymentModal(visible) {
        this.props.showPaymentModal(visible);
    }

    routeToEdit() {
        Actions.editRequest({buttonText: 'Update Preferences'});
    }

    checkForDate(date) {
        if (date) {
            let formattedDate = (moment(date).format('MMMM Do'));
            return formattedDate
        }
    }

    checkForPremium() {
        if (this.props.currentSelectedPackage === 'Premium') {
            return <Image source={require('../../assets/icon_premiumpackage@3x.png')}/>
        } else {
            return
        }
    }

    checkForSmart() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <Image source={require('../../assets/icon_smartpack@3x.png')}/>
        } else {
            return
        }
    }

    afterCalendarPurchase(id) {
        if (this.props.networkStatus != 'none') {

            let currentPrice = 0;

            if (this.props.currentSelectedPackage === 'Smart') {
                switch (this.props.currentApartmentSelection) {
                    case 'Studio':
                        currentPrice = 199;
                        break;
                    case '1 Bedroom':
                        currentPrice = 249;
                        break;
                    case '2 Bedroom':
                        currentPrice = 349;
                        break;
                    default:
                        return 'Problem getting price, try again'
                }
            } else if (this.props.currentSelectedPackage === 'Premium') {
                switch (this.props.currentApartmentSelection) {
                    case 'Studio':
                        currentPrice = 499;
                        break;
                    case '1 Bedroom':
                        currentPrice = 549;
                        break;
                    case '2 Bedroom':
                        currentPrice = 599;
                        break;
                    default:
                        return 'Problem getting price, try again'
                }
            }
            if (currentPrice === 0) {
                AlertIOS.alert('Oops', 'Something went wrong. Please try again or contact support.')
            } else {
                if (!this.props.comingFromCompleted) {
                    let database = firebase.database();
                    database.ref('/user/' + this.props.userId).once('value').then((snapshot) => {
                        database.ref('/processing/' + this.props.userId).set(snapshot.val()).then(() => {
                            database.ref('/processing/' + this.props.userId).update({
                                purchasedPrice: currentPrice,
                                purchaseDate: new Date()
                            })
                                .then(() => {
                                    database.ref('/user/' + this.props.userId).remove();
                                });
                        })
                    })
                } else {
                    let database = firebase.database();
                    database.ref('/completed/' + this.props.userId).once('value').then((snapshot) => {
                        database.ref('/processing/' + this.props.userId).set(snapshot.val()).then(() => {
                            database.ref('/processing/' + this.props.userId).update({
                                purchasedPrice: currentPrice,
                                purchaseDate: new Date()
                            })
                                .then(() => {
                                    database.ref('/completed/' + this.props.userId).remove();
                                });
                        })
                    })
                }
                let priceRange = this.props.currentApartmentPrice[0] + '-' + this.checkForMaxPrice(this.props.currentApartmentPrice[1])
                // console.log(this.props.email)
                axios.post('https://smoove-api.herokuapp.com/api/sendEmail', {
                    sendTo: this.props.email,
                    priceRange: priceRange,
                    apartmentType: this.props.currentApartmentSelection,
                    packagePrice: this.checkForCurrentPrice(),
                    startDate: this.checkForEmailDays(),
                    locations: this.checkForSelectedEmailCities(),
                    availability: this.checkForEmailDays(),
                    packageType: this.props.currentSelectedPackage,
                    packageDescription: this.getEmailPackageDescription()

                }).then((response) => {
                    // console.log(response);
                })  ///sending email
                let database = firebase.database()
                database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903').once('value').then((snapshot) => {
                    if (snapshot.val()) {
                        let currentNotifArray = snapshot.val().notifications;
                        let newNotif = {
                            time: new Date(),
                            message: this.props.fullName + ' ' + 'purchased package!',
                            body: 'waiting for guide assignment',
                            idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
                            notificationSeen: false,
                            senderId: this.props.userId
                        }
                        currentNotifArray.push(newNotif);

                        database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903').update({
                            notifications: currentNotifArray
                        })
                    } else {
                        let newNotif = {
                            time: new Date(),
                            message: this.props.fullName + ' ' + 'purchased package!',
                            body: 'waiting for guide assignment',
                            idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
                            notificationSeen: false,
                            senderId: this.props.userId
                        }
                        let currentNotifArray = [newNotif]
                        database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903').update({
                            notifications: currentNotifArray
                        })
                        database.ref('/notifications/notificationArray').update({
                            notifications: [newNotif]
                        })
                    }
                });
                let newNotif = {
                    time: new Date(),
                    message: this.props.fullName + ' ' + 'purchased package!',
                    body: 'waiting for guide assignment',
                    idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
                    notificationSeen: false
                }
                firebase.database().ref('/notifications/notificationArray').update({
                    notifications: [newNotif]
                })

                this.props.hideSecondPaymentModal()
                this.props.showModal(false);
                this.setState({
                    warningTimeModal: false,
                    purchasedModal: true

                })
            }

        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }

    }

    listEmailLocations() {
        let locations = this.props.currentlySelectedCities
        let locationString = ''
        for (let i = 0, theLength = locations.length; i < theLength; i++) {
            locationString += locations[i] + ',' + ' '
        }
        // console.log('the locations' + locationString)
        return locationString
    }

    getEmailPackageDescription() {
        let chosenPackage = this.props.currentSelectedPackage
        if (chosenPackage === 'Smart') {
            return '3 apartments to view, hotel suggestions, our guide will pick you up and drop you off after viewing all apartments, and our guide will provide a folder which contains information on the area you choose to live in.'
        } else if (chosenPackage === 'Premium') {
            return '5 apartments to view, hotel suggestions, pre-paid SIM card, airport pick up from LAX and drop off limited to certain selected cities, our guide will pick you up and drop you off after viewing all apartments, and our guide will provide a folder which contains information on the area you choose to live in.'
        }
    }

    checkForShowDate() {
        let nowDate = moment().format();
        let savedDate = moment(this.props.currentlySelectedDate).format();
        let difference = moment(nowDate).diff(savedDate, 'hours');
        let isAfter = moment(nowDate).isAfter(savedDate);
        if ((difference > 48 || difference < -48) && !isAfter) {
            return false
        } else {
            return true
        }
    }

    purchasePackage() {
        if (this.props.networkStatus != 'none') {
            let isWithinTime = this.checkForShowDate()
            if (isWithinTime) {
                this.props.hideSecondPaymentModal()
                this.props.showModal(false);
                this.setState({
                    warningTimeModal: true
                })
            } else {
                this.afterCalendarPurchase()
            }
        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }

    }

    acceptPurchaseRoute() {
        this.setState({
            purchasedModal: false
        })
        Actions.mainAfterPurchase()
    }

    checkForSelectedCities() {
        let cityArray = this.props.currentlySelectedCities
        if (this.props.currentlySelectedCities) {
            if (this.props.currentlySelectedCities.length > 1) {
                if (cityArray.length > 1) {
                    let cityArrayString = ''
                    for (let i = 0, theLength = cityArray.length; i < theLength; i++) {
                        cityArrayString = cityArrayString + cityArray[i] + ',' + ' '
                    }
                    let theLength = cityArrayString.length
                    cityArrayString = cityArrayString.substring(0, theLength - 2)
                    return cityArrayString
                } else {
                    return cityArray[0]
                }
            }
        }
        else {
            return ''
        }
    }

    checkForSelectedEmailCities() {
        let cityArray = this.props.currentlySelectedCities
        if (this.props.currentlySelectedCities) {
            if (this.props.currentlySelectedCities.length > 1) {
                if (cityArray.length > 1) {
                    let cityArrayString = ''
                    for (let i = 0, theLength = cityArray.length; i < theLength; i++) {
                        cityArrayString = cityArrayString + cityArray[i] + '•' + ' '
                    }
                    let theLength = cityArrayString.length
                    cityArrayString = cityArrayString.substring(0, theLength - 2)
                    return cityArrayString
                } else {
                    return cityArray[0]
                }
            }
        }
        else {
            return ''
        }
    }

    checkForSelectedDays() {
        let dayArray = this.props.currentlySelectedDays
        if (dayArray && dayArray.length > 0) {
            if (dayArray.length > 1) {
                let dayArrayString = ''
                for (let i = 0, theLength = dayArray.length; i < theLength; i++) {
                    dayArrayString = dayArrayString + dayArray[i].dayOfWeek + ',' + ' '
                }
                let theLength = dayArrayString.length
                dayArrayString = dayArrayString.substring(0, theLength - 2)
                return dayArrayString
            } else {
                return dayArray[0].dayOfWeek
            }
        }

    }

    changePackageAndHide() {
        //	console.log(this.state.bounceValueTwo.toValue)
        if (packageIsHidden === false) {
            this.toggleSubviewTwo()
            setTimeout(() => {
                this.setState({
                    showChangePackage: false
                })
            }, 320)
        }
    }

    showPricing() {
        if (this.state.showPricing === false && pricingIsHidden === true) {
            this.toggleSubviewTwo()
            setTimeout(() => {
                this.setState({
                    showPricing: true,
                    showChangePackage: false
                })

                this.toggleSubviewThree()
            }, 300)
        }
    }

    hidePricing() {
        if (pricingIsHidden === false) {
            this.toggleSubviewThree()
            setTimeout(() => {
                this.setState({
                    showRequirements: false,
                    showChangePackage: false,
                    showPricing: false
                })
            }, 320)
        }
    }

    showPackageDescriptions() {
        if (this.props.networkStatus != 'none') {
            if (this.state.showChangePackage === false && packageIsHidden === true) {

                this.setState({showChangePackage: true})
                this.toggleSubviewTwo()

            }
        } else {
            setTimeout(() => {
                AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
            }, 1000)
        }
    }

    checkForCurrentPrice() {
        if (this.props.currentSelectedPackage === 'Smart') {
            switch (this.props.currentApartmentSelection) {
                case 'Studio':
                    return '$199';
                    break;
                case '1 Bedroom':
                    return '$249';
                    break;
                case '2 Bedroom':
                    return '$349';
                    break;
                default:
                    return 'Problem getting price, try again'
            }
        } else if (this.props.currentSelectedPackage === 'Premium') {
            switch (this.props.currentApartmentSelection) {
                case 'Studio':
                    return '$499';
                    break;
                case '1 Bedroom':
                    return '$549';
                    break;
                case '2 Bedroom':
                    return '$599';
                    break;
                default:
                    return 'Problem getting price, try again'
            }
        }
    }

    checkForAddedCard() {
        // console.log(this.props.cardJustAdded)
        if (this.props.cardJustAdded) {
            return true
        } else {
            return false
        }
    }

    getPrice() {
        if (this.props.currentSelectedPackage === 'Smart') {
            switch (this.props.currentApartmentSelection) {
                case 'Studio':
                    return '$199';
                    break;
                case '1 Bedroom':
                    return '$249';
                    break;
                case '2 Bedroom':
                    return '$349';
                    break;
                default:
                    return 'Problem getting price, try again'
            }
        } else if (this.props.currentSelectedPackage === 'Premium') {
            switch (this.props.currentApartmentSelection) {
                case 'Studio':
                    return '$499';
                    break;
                case '1 Bedroom':
                    return '$549';
                    break;
                case '2 Bedroom':
                    return '$599';
                    break;
                default:
                    return 'Problem getting price, try again'
            }
        }
    }

    checkForWhichPackage() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <Image source={require('../../assets/icon_smart@3x.png')}/>
        } else if (this.props.currentSelectedPackage === 'Premium') {
            return <Image source={require('../../assets/icon_premium@3x.png')}/>
        }
    }

    checkForWhichText() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <Text style={{fontFamily: 'PTSans-CaptionBold', fontSize: 20, color: 'rgb(61,61,61)'}}>Smart
                Package</Text>
        } else if (this.props.currentSelectedPackage === 'Premium') {
            return <Text style={{fontFamily: 'PTSans-CaptionBold', fontSize: 20, color: 'rgb(61,61,61)'}}>Premium
                Package</Text>
        }
    }

    checkForModalHeight() {
        if (width <= 321) {
            return '80%'
        } else {
            return '60%'
        }
    }

    checkForPaymentRoute() {
        // console.log(this.props.cardJustAdded)
        if (this.props.cardJustAdded === true) {
            return <TouchableHighlight onPress={() => this.props.hideSecondPaymentModal()} activeOpacity={1}
                                       underlayColor="rgba(0,0,0,0.6)" style={{
                flex: 1,
                zIndex: 999999,
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)'
            }}>
                <View style={{
                    flex: 0,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    height: this.checkForModalHeight(),
                    width: 345,
                    backgroundColor: '#fff',
                    padding: 10,
                    zIndex: 9999999
                }}>
                    <Text style={{textDecorationLine: 'underline', fontSize: 22, fontFamily: 'PTSans-Caption'}}>You've
                        selected the:</Text>

                    <View style={{
                        flex: 0,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        width: '100%',
                        height: '25%'
                    }}>

                        {this.checkForWhichPackage()}
                        {this.checkForWhichText()}
                    </View>
                    <Hr lineColor="rgba(51,51,51,0.14)"/>

                    <View style={{
                        width: '100%',
                        height: 57,
                        flex: -1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{color: 'rgb(51,51,51)', fontSize: 12, fontFamily: 'PTSans-Caption'}}>
                                Apt Type:
                            </Text>
                            <Text style={{color: 'rgb(68,149,203)', fontFamily: 'PTSans-CaptionBold', fontSize: 21}}>
                                {this.props.currentApartmentSelection}
                            </Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{color: 'rgb(51,51,51)', fontSize: 12, fontFamily: 'PTSans-Caption'}}>
                                Package Total:
                            </Text>
                            <Text style={{color: 'rgb(68,149,203)', fontFamily: 'PTSans-CaptionBold', fontSize: 21}}>
                                {this.checkForCurrentPrice()}
                            </Text>
                        </View>
                    </View>
                    <Hr lineColor="rgba(51,51,51,0.14)"/>

                    <TouchableOpacity onPress={() => this.purchasePackage()} style={{height: 45, width: 335}}>
                        <Image source={require('../../assets/button_newrequest.png')} style={{
                            width: '100%',
                            height: '100%',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            resizeMode: 'cover'
                        }}>
                            <Text style={{
                                fontFamily: 'PTSans-CaptionBold',
                                fontSize: 21,
                                color: '#fff',
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}>
                                Purchase Now
                            </Text>
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.props.hideSecondPaymentModal()
                    }}>
                        <Text style={{
                            color: 'rgba(68,149,203,100)',
                            fontFamily: 'PTSans-Caption',
                            fontSize: 20
                        }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 11, textAlign: 'center', fontFamily: 'PTSans-Caption'}}>
                        By tapping "Purchase Now" the card on file will {'\n'}not be charged until the day of your first
                        appointment.{'\n'} For further information, check out the{'\n'} cancellation policy in the menu.
                    </Text>
                </View>
            </TouchableHighlight>
        } else {
            return;
        }


    }

    checkForListedPrices() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <View style={{flex: 0, height: 50, justifyContent: 'flex-start', flexDirection: 'row'}}>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text
                        style={{fontSize: 17, fontFamily: 'PTSans-CaptionBold'}}> {this.props.currentApartmentSelection}: </Text>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'PTSans-CaptionBold',
                        color: 'rgb(68,149,203)'
                    }}> {this.getPrice()}  </Text>
                </View>


            </View>
        } else if (this.props.currentSelectedPackage === 'Premium') {
            return <View style={{flex: 0, height: 50, justifyContent: 'flex-start', flexDirection: 'row'}}>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text
                        style={{fontSize: 17, fontFamily: 'PTSans-CaptionBold'}}> {this.props.currentApartmentSelection}: </Text>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'PTSans-CaptionBold',
                        color: 'rgb(68,149,203)'
                    }}> {this.getPrice()}  </Text>
                </View>
            </View>
        }
    }

    checkForWhichPackageDesc() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <View
                style={{flex: 0, height: 280, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>
                <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text
                    style={{fontSize: 23, fontFamily: 'PTSans-CaptionBold'}}> 3 </Text> </Text>
                <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
                <View>
                    <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up
                        and drop you </Text>
                    <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> off after viewing all
                        apartments </Text>
                </View>
                <View>
                    <Text style={{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}>
                        Our Guide will provide a folder which
                    </Text>
                    <Text style={{fontSize: 13, marginLeft: -4, fontFamily: 'PTSans-Caption', marginTop: 4}}> contains
                        information
                        on the area </Text>
                    <Text style={{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}>
                        you choose to live in.
                    </Text>
                </View>

            </View>
        } else if (this.props.currentSelectedPackage === 'Premium') {
            return <View
                style={{flex: 0, height: 280, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>
                <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text
                    style={{fontSize: 23, fontFamily: 'PTSans-CaptionBold'}}> 5 </Text> </Text>
                <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
                <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Pre-paid SIM card </Text>
                <View>
                    <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Airport pick up from LAX
                        and drop off</Text>
                    <Text style={{fontSize: 13, marginLeft: 1, fontFamily: 'PTSans-Caption', marginTop: 4}}> limited to
                        certain selected cities</Text>
                </View>
                <View>
                    <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up
                        and drop you </Text>
                    <Text style={{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> off after viewing all
                        apartments </Text>
                </View>
                <View>
                    <Text style={{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}>
                        Our Guide will provide a folder which
                    </Text>
                    <Text style={{fontSize: 13, marginLeft: -4, fontFamily: 'PTSans-Caption', marginTop: 4}}> contains
                        information
                        on the area </Text>
                    <Text style={{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}>
                        you choose to live in.
                    </Text>
                </View>

            </View>
        }
    }

    checkForMaxPrice(price) {
        if (price === 5000) {
            return 'No Max'
        } else {
            return '$' + price
        }
    }


    listAllPrices() {
        if (this.props.currentSelectedPackage === 'Smart') {
            return <View
                style={{flex: 0, height: 280, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>

                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> Studio: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$199 </Text>
                </View>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> 1 Bedroom: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$249 </Text>
                </View>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> 2 Bedroom: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$349 </Text>
                </View>

            </View>
        } else if (this.props.currentSelectedPackage === 'Premium') {
            return <View
                style={{flex: 0, height: 280, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>

                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> Studio: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$499 </Text>
                </View>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> 1 Bedroom: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$549 </Text>
                </View>
                <View style={{
                    flex: -1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold'}}> 2 Bedroom: </Text>
                    <Text
                        style={{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}>$599 </Text>
                </View>

            </View>
        }
    }

    checkForSmallScreenText() {
        if (width <= 321) {
            return 12
        } else {
            return 14
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
        // console.log(this.props.currentlySelectedDate)
        var currentSavedDate = moment(this.props.currentlySelectedDate).format("dddd, MMMM Do");
        return (
            <View style={styles.containerStyle}>
            <View style={styles.subContainerStyle}>
                {this.checkForPaymentRoute()}
                <StatusBar
                    backgroundColor="#bebebe"
                    barStyle="light-content"
                />
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showRequirements}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight onPress={() => this.hideRequirements()} activeOpacity={1}
                                        underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <Animated.View style={[styles.secondSubView,
                            {transform: [{translateY: this.state.bounceValueTwo}]}]}>
                            <TouchableOpacity style={{
                                zIndex: 9999,
                                position: 'absolute',
                                top: 0,
                                width: '110%',
                                height: 44,
                                flex: -0,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgb(68,149,203)'
                            }} onPress={() => this.hideRequirements()}>
                                <Text style={{
                                    fontFamily: 'PTSans-CaptionBold',
                                    color: '#fff',
                                    fontSize: 16,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>Your Preferences</Text>
                            </TouchableOpacity>
                            <View style={{
                                flex: 0,
                                width: '90%',
                                paddingTop: 30,
                                alignContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                marginTop: 50,
                                flexDirection: 'column'
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: 0,
                                        width: width,
                                        zIndex: 9999999,
                                        fontFamily: 'PTSans-CaptionBold',
                                        color: 'rgb(68,149,203)'
                                    }}> Location(s) </Text>
                                    <Text style={{
                                        fontFamily: 'PTSans-CaptionBold',
                                        fontSize: this.checkForSmallScreenText(),
                                        color: '(rgb(61,61,61)',
                                        width: width
                                    }}>
                                        {this.checkForCities()}
                                    </Text>
                                </View>
                                <Hr lineColor="rgb(151,151,151)"/>
                                <View style={{
                                    flex: 1,

                                    flexDirection: 'column'
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        textAlign: 'center',
                                        marginTop: 30,
                                        marginBottom: 10,
                                        fontFamily: 'PTSans-CaptionBold',
                                        color: 'rgb(68,149,203)'
                                    }}> Availability Dates for Apartment Viewing </Text>
                                    <Text style={{
                                        fontFamily: 'PTSans-CaptionBold',
                                        fontSize: this.checkForSmallScreenText(),
                                        color: '(rgb(61,61,61)',
                                        width: width,
                                        paddingBottom: 3
                                    }}>
                                        {this.checkForDays()}
                                    </Text>
                                </View>
                            </View>


                        </Animated.View>
                    </TouchableHighlight>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.warningTimeModal}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight onPress={() => this.setState({confirmCancelModal: false})} activeOpacity={1}
                                        underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <Image source={require('../../assets/purchased@3x.png')} style={{
                            flex: 0,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            backgroundColor: 'rgba(0,0,0,0)',
                            padding: 10
                        }}>
                            <Image source={require('../../assets/nav_bar_logo.png')} style={{
                                position: 'absolute',
                                top: 11,
                                height: 36,
                                width: 36,
                                resizeMode: 'contain'
                            }}/>
                            <Image source={require('../../assets/nav_logo.png')}
                                   style={{height: 15, width: 105, position: 'absolute', top: 55}}/>
                            <Text style={{
                                position: 'absolute',
                                height: 100,
                                width: '100%',
                                textAlign: 'center',
                                top: 80,
                                color: 'rgb(51,51,51)',
                                fontSize: 15,
                                fontFamily: 'PTSans-CaptionBold'
                            }}>
                                According to the cancellation policy, since your service starts in less than 48 hours,
                                if you cancel you won't be refunded.
                            </Text>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: 192,
                                width: 226,
                                height: 40
                            }}>
                                <TouchableHighlight activeOpacity={1} underlayColor="rgba(68,149,203,100)" style={{
                                    height: 40,
                                    width: 113,
                                    left: 0,
                                    borderRightWidth: 0.5,
                                    borderColor: '#fff',
                                    backgroundColor: 'rgba(68,149,203,100)',
                                    flex: -1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={() => this.afterCalendarPurchase()}>
                                    <Text
                                        style={{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>Okay</Text>
                                </TouchableHighlight>
                                <TouchableHighlight activeOpacity={1} underlayColor="rgba(68,149,203,100)" style={{
                                    height: 40,
                                    width: 113,
                                    flex: -1,
                                    backgroundColor: 'rgba(68,149,203,100)',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={() => this.setState({warningTimeModal: false})}>
                                    <Text
                                        style={{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </Image>
                    </TouchableHighlight>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showChangePackage}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight onPress={() => this.changePackageAndHide()} activeOpacity={1}
                                        underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <Animated.View style={[styles.secondSubView,
                            {transform: [{translateY: this.state.bounceValueTwo}]}]}>
                            <TouchableOpacity style={{
                                zIndex: 9999,
                                position: 'absolute',
                                top: 0,
                                width: '110%',
                                height: 44,
                                flex: -0,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgb(68,149,203)'
                            }} onPress={() => this.changePackageAndHide()}>
                                <Text style={{
                                    fontFamily: 'PTSans-CaptionBold',
                                    color: '#fff',
                                    fontSize: 16,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>Your package of preference</Text>
                            </TouchableOpacity>
                            <View style={{
                                flex: 0,
                                width: '90%',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                height: 100,
                                marginTop: 50,
                                flexDirection: 'row'
                            }}>


                                {this.checkForSmart()}


                                {this.checkForPremium()}

                            </View>
                            <Hr lineColor="rgb(151,151,151)"/>
                            <TouchableOpacity onPress={() => this.showPricing()}
                                              style={{position: 'absolute', top: 170, zIndex: 999999, right: 20}}>
                                <Text style={{color: 'rgb(68,149,203)', fontFamily: 'PTSans-Caption', fontSize: 15}}>
                                    See Pricing</Text>
                            </TouchableOpacity>
                            {this.checkForWhichPackageDesc()}
                            <Hr lineColor="rgb(151,151,151)"/>
                            {this.checkForListedPrices()}

                        </Animated.View>
                    </TouchableHighlight>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showPricing}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight onPress={() => this.hidePricing()} activeOpacity={1}
                                        underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        zIndex: 9999999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <Animated.View style={[styles.thirdSubView,
                            {transform: [{translateY: this.state.bounceValueThree}]}]}>
                            <TouchableOpacity style={{
                                zIndex: 99999999,
                                position: 'absolute',
                                top: 0,
                                width: '110%',
                                height: 44,
                                flex: -0,
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgb(68,149,203)'
                            }} onPress={() => this.hidePricing()}>
                                <Text style={{
                                    fontFamily: 'PTSans-CaptionBold',
                                    color: '#fff',
                                    fontSize: 16,
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}>Close</Text>
                            </TouchableOpacity>
                            <View style={{
                                flex: 0,
                                width: '90%',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                height: 100,
                                marginTop: 50,
                                flexDirection: 'row'
                            }}>


                                {this.checkForSmart()}


                                {this.checkForPremium()}

                            </View>
                            <Hr lineColor="rgb(151,151,151)"/>
                            {this.listAllPrices()}
                        </Animated.View>
                    </TouchableHighlight>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight
                        style={{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}}
                        onPress={() => this.setModalVisible(!this.props.modalVisible)} activeOpacity={1}
                        underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <View style={{
                            flex: 0,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            height: this.checkForModalHeight(),
                            width: 345,
                            zIndex: 999999,
                            backgroundColor: '#fff',
                            padding: 10
                        }}>
                            <Text style={{textDecorationLine: 'underline', fontSize: 22, fontFamily: 'PTSans-Caption'}}>You've
                                chosen the:</Text>

                            <View style={{
                                flex: 0,
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                width: '100%',
                                height: '25%'
                            }}>

                                {this.checkForWhichPackage()}
                                {this.checkForWhichText()}
                            </View>
                            <Hr lineColor="rgba(51,51,51,0.14)"/>

                            <View style={{
                                width: '100%',
                                height: 57,
                                flex: -1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}>
                                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: 'rgb(51,51,51)', fontSize: 13, fontFamily: 'PTSans-Caption'}}>
                                        Apt Type:
                                    </Text>
                                    <Text style={{
                                        color: 'rgb(68,149,203)',
                                        fontFamily: 'PTSans-CaptionBold',
                                        fontSize: 22
                                    }}>
                                        {this.props.currentApartmentSelection}
                                    </Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                                    <Text style={{color: 'rgb(51,51,51)', fontSize: 13, fontFamily: 'PTSans-Caption'}}>
                                        Package Total:
                                    </Text>
                                    <Text style={{
                                        color: 'rgb(68,149,203)',
                                        fontFamily: 'PTSans-CaptionBold',
                                        fontSize: 22
                                    }}>
                                        {this.checkForCurrentPrice()}
                                    </Text>
                                </View>
                            </View>
                            <Hr lineColor="rgba(51,51,51,0.14)"/>

                            <TouchableOpacity onPress={() => this.purchasePackage()} style={{height: 45, width: 335}}>
                                <Image source={require('../../assets/button_newrequest.png')} style={{
                                    width: '100%',
                                    height: '100%',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    resizeMode: 'cover'
                                }}>
                                    <Text style={{
                                        fontFamily: 'PTSans-CaptionBold',
                                        fontSize: 21,
                                        color: '#fff',
                                        backgroundColor: 'rgba(0,0,0,0)'
                                    }}>
                                        Purchase Now
                                    </Text>
                                </Image>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                this.setModalVisible(!this.props.modalVisible)
                            }}>
                                <Text
                                    style={{color: 'rgba(68,149,203,100)', fontFamily: 'PTSans-Caption', fontSize: 20}}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize: 11, textAlign: 'center', fontFamily: 'PTSans-Caption'}}>
                                By tapping "Purchase Now" the card on file will {'\n'}not be charged until the day of
                                your first appointment.{'\n'} For further information, check out the{'\n'} cancellation
                                policy in the menu.
                            </Text>
                        </View>
                    </TouchableHighlight>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.purchasedModal}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>
                        <Image source={require('../../assets/purchased@3x.png')} style={{
                            flex: 0,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            backgroundColor: 'rgba(0,0,0,0)',
                            padding: 10,
                            zIndex: 999999
                        }}>
                            <Image source={require('../../assets/nav_bar_logo.png')} style={{
                                position: 'absolute',
                                top: 11,
                                height: 36,
                                width: 36,
                                resizeMode: 'contain'
                            }}/>
                            <Image source={require('../../assets/nav_logo.png')}
                                   style={{height: 15, width: 105, position: 'absolute', top: 55}}/>
                            <Text style={{
                                position: 'absolute',
                                top: 85,
                                color: 'rgb(51,51,51)',
                                fontSize: 20,
                                fontFamily: 'PTSans-CaptionBold'
                            }}>Package Purchased!</Text>
                            <Text style={{
                                position: 'absolute',
                                height: 72,
                                width: '100%',
                                textAlign: 'center',
                                top: 115,
                                color: 'rgb(51,51,51)',
                                fontSize: 14,
                                fontFamily: 'PTSans-Caption'
                            }}>
                                Congrats! You just took the first
                                step in finding a new home! A
                                Smoove guide will be contacting
                                you shortly!
                            </Text>
                            <TouchableOpacity style={{
                                height: 40,
                                width: 226,
                                flex: -1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: 195
                            }} onPress={() => this.acceptPurchaseRoute()}>
                                <Text style={{
                                    fontSize: 25,
                                    color: 'rgb(255,255,255)',
                                    fontFamily: 'PTSans-Caption'
                                }}>OK</Text>
                            </TouchableOpacity>
                        </Image>
                    </View>
                </Modal>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.props.paymentModalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <TouchableHighlight onPress={() => this.showPaymentModal(!this.props.paymentModalVisible)}
                                        activeOpacity={1} underlayColor="rgba(0,0,0,0.6)" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)'
                    }}>

                        <Image source={require('../../assets/purchased@3x.png')} style={{
                            flex: 0,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            backgroundColor: 'rgba(0,0,0,0)',
                            padding: 10
                        }}>
                            <Image source={require('../../assets/nav_bar_logo.png')} style={{
                                position: 'absolute',
                                top: 11,
                                height: 36,
                                width: 36,
                                resizeMode: 'contain'
                            }}/>
                            <Image source={require('../../assets/nav_logo.png')}
                                   style={{height: 15, width: 105, position: 'absolute', top: 55}}/>

                            <Text style={{
                                position: 'absolute',
                                height: 72,
                                width: '100%',
                                textAlign: 'center',
                                top: 85,
                                color: 'rgb(51,51,51)',
                                fontSize: 14,
                                fontFamily: 'PTSans-Caption'
                            }}>
                                Oops! It looks like you haven't added a credit card yet.
                                Add one now to complete your purchase.
                            </Text>
                            <TouchableOpacity style={{
                                height: 40,
                                width: 226,
                                flex: -1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: 195
                            }} onPress={() => {
                                this.showPaymentModal(!this.props.paymentModalVisible);

                                Actions.addCard();
                            }}>
                                <Text style={{
                                    fontSize: 25,
                                    color: 'rgb(255,255,255)',
                                    fontFamily: 'PTSans-Caption'
                                }}>OK</Text>
                            </TouchableOpacity>
                        </Image>
                    </TouchableHighlight>
                </Modal>
                <View style={{
                    height: 406,
                    flex: 0,
                    width: '100%',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 13
                }}>
                    <Hr lineColor="rgb(151,151,151)" textColor="rgb(68,149,203)" text="Apartment type"/>
                    <Text style={{
                        fontFamily: 'PTSans-CaptionBold',
                        fontSize: 30,
                        color: 'rgb(61,61,61)'
                    }}>
                        {this.props.currentApartmentSelection}
                    </Text>
                    <Hr lineColor="rgb(151,151,151)" textColor="rgb(68,149,203)" text="Desired price"/>
                    <Text style={{
                        fontFamily: 'PTSans-CaptionBold',
                        fontSize: 30,
                        color: 'rgb(61,61,61)'
                    }}>
                        ${this.props.currentApartmentPrice[0]}
                        - {this.checkForMaxPrice(this.props.currentApartmentPrice[1])}
                    </Text>
                    <View style={{
                        width: '100%',
                        height: '50%',
                        flex: 0,
                        paddingTop: 50,
                        justifyContent: 'flex-start'
                    }}>


                    </View>

                </View>
                <View style={{height: 99, width: '100%', position: 'absolute', top: 300, zIndex: 99999}}>
                    <View style={{height: 0.5, width: '100%'}}>
                        <Hr lineColor="rgb(207,205,205)"/>
                    </View>
                    <TouchableOpacity onPress={() => this.showRequirements()} style={styles.rowStyle}>
                        <Text style={{
                            fontFamily: 'PTSans-Caption',
                            marginLeft: 10,
                            color: '(rgb(61,61,61)',
                            fontSize: 12
                        }}> Requirements </Text>
                        <Image style={{marginRight: 10}} source={require('../../assets/pin_downward.png')}/>
                    </TouchableOpacity>
                    <View style={{height: 0.5, width: '100%'}}>
                        <Hr lineColor="rgb(207,205,205)"/>
                    </View>
                    <TouchableOpacity style={styles.rowStyle} onPress={() => this.showPackageDescriptions()}>
                        <Text style={{
                            fontFamily: 'PTSans-Caption',
                            marginLeft: 10,
                            color: '(rgb(61,61,61)',
                            fontSize: 12
                        }}> Current Package </Text>
                        <View style={{
                            flex: 0,
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'PTSans-CaptionBold',
                                marginRight: 10,
                                color: '(rgb(61,61,61)',
                                fontSize: 12
                            }}>{this.props.currentSelectedPackage}</Text>
                            <Image style={{marginRight: 10}} source={require('../../assets/pin_downward.png')}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: 0.5, width: '100%'}}>
                        <Hr lineColor="rgb(207,205,205)"/>
                    </View>
                </View>
                <View style={{width: '100%', height: '25%'}}/>
                <View style={{
                    width: '100%',
                    height: 49,
                    flex: 0,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    bottom: 0
                }}>
                    <View style={styles.viewStyle}>
                        <TouchableOpacity onPress={() => this.routeToEdit()} style={styles.buttonStyle}>
                            <Text style={styles.textStyle}>
                                Edit Request
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewStyle}>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)} style={styles.buttonStyle}>
                            <Text style={styles.textStyle}>
                                Purchase Package
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
                <Header
                    backgroundColor="rgba(61,61,61,1)"
                    outerContainerStyles={{borderBottomColor: 'rgba(61,61,61,0)'}}
                    leftComponent={<Icon name='user' type="font-awesome" color='white' onPress={() => Actions.profile()}/>}
                    centerComponent={
                        <TouchableOpacity onPress={this.onPressHome}>
                            <Image style={{height: 30, width: 30, marginRight: 10}}
                                   source={require('../../assets/nav_bar_logo.png')}/>
                        </TouchableOpacity>}
                    rightComponent={<Icon name='bubble' type="simple-line-icon" color='white' iconStyle={{marginTop: 15}}
                                          onPress={() => Actions.clientChat({typeOfChat: 'guide'})}/>}
                />
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        marginTop: -65,
    },
    subContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        // width: null,
        // height: null,
        marginTop: 65,
        backgroundColor: 'rgb(244,244,244)'
    },
    sliderStyle: {
        width: '80%'
    },
    bottomListItem: {
        flex: 0,
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    rowStyle: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44
    },
    viewStyle: {
        width: '49.9%',
        height: '100%'
    },
    buttonStyle: {
        flex: 1,
        backgroundColor: 'rgba(68,149,203,100)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#fff',
        padding: 5,
        fontFamily: 'PTSans-Caption',
        fontSize: 17
    },
    secondSubView: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 500,
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        padding: 10
    },
    thirdSubView: {
        flex: 0,
        alignItems: 'center',
        zIndex: 9999999,
        justifyContent: 'space-around',
        height: 500,
        width: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        padding: 10
    },
};
const mapStateToProps = (state) => {
    return {
        currentApartmentPrice: state.getStarted.currentApartmentPrice,
        currentlySelectedDate: state.getStarted.currentlySelectedDate,
        currentlySelectedCities: state.getStarted.currentlySelectedCities,
        currentlySelectedDays: state.getStarted.currentlySelectedDays,
        currentApartmentSelection: state.getStarted.currentApartmentSelection,
        modalVisible: state.getStarted.modalVisible,
        paymentModalVisible: state.getStarted.paymentModalVisible,
        currentSelectedPackage: state.getStarted.currentSelectedPackage,
        comingFromCompleted: state.getStarted.comingFromCompleted,
        userId: state.onboarding.userId,
        stripeToken: state.getStarted.stripeToken,
        email: state.getStarted.email,
        fullName: state.getStarted.fullName,
        cardJustAdded: state.getStarted.cardJustAdded,
        networkStatus: state.guide.networkStatus,
        version: state.getStarted.version
    };
};
export default connect(mapStateToProps,
    {showModal, selectPremiumPackage, selectSmartPackage, showPaymentModal, hideSecondPaymentModal})(MainView);
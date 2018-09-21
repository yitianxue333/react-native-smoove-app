import React, {Component} from 'react';
import {Text, TouchableOpacity, TouchableHighlight, View, Slider, Image, DatePickerIOS, Modal, Animated, Dimensions, StatusBar, AlertIOS, ActivityIndicator} from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import {showModal, selectPremiumPackage, selectSmartPackage, saveUserInfo, changeSelectedPackage} from '../../actions';
import moment from 'moment';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var isHidden = true
var packageIsHidden = true
var width = Dimensions.get('window').width

class MainAfterPurchase extends Component {
	componentWillMount() {
		this.state = {
			purchasedModal: false,
			cancelModal: false,
			confirmCancelModal: false,
			showChangePackage: false,
			bounceValue: new Animated.Value(240),
			bounceValueTwo: new Animated.Value(500),
			showChangePackage: false,
			showRequirements: false,
			cancelWarningModal: false,
			cancelModalTwo: false,
			animating: false 
		}
		
	}
	componentDidMount() {
		setTimeout(() => {
		firebase.database().ref('/processing/' + this.props.userId).on('value', (snapshot) => {
			if (snapshot.val()) {
				this.props.saveUserInfo(snapshot.val(), 'processing');
			}
			setTimeout(() => {
				if (!snapshot.val()) {
					this.setState({
						purchasedModal: true
					})
				}
			}, 3000)	
		})
		}, 1000)
		
	}
	componentWillUnmount() {
		firebase.database().ref('/processing/' + this.props.userId).off();
	}
	toggleSubview() {    

		var toValue = 240;

		if(isHidden) {
		toValue = 0;
		}
		//This will animate the transalteY of the subview between 0 & 100 depending on its current state
		//100 comes from the style below, which is the height of the subview.
		Animated.spring(
		this.state.bounceValue,
		{
			toValue: toValue,
			velocity: 7,
			tension: 2,
			friction: 4,
		}
		).start();
		isHidden = !isHidden;
	}
	toggleSubviewTwo() {    

		var toValue = 500;

		if(packageIsHidden) {
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
    cancelPurchase(isCharged) {
		
		this.setState({
			confirmCancelModal: false
		})
		axios.post('https://smoove-api.herokuapp.com/api/cancelEmail', {
						sendTo: this.props.email
				}).then((response) => {
                                
                            })  ///sending email
		if (this.props.networkStatus != 'none') {
			firebase.database().ref('/processing/' + this.props.userId).off()
			if (this.props.guidesName && this.props.guidesName !== '' && !isCharged) {
				axios.post('https://smoove-api.herokuapp.com/api/refundcard', {customerId: this.props.stripeToken}).then((response) => {
							
						})
			}
			let database = firebase.database()
					database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903').once('value').then((snapshot) => {
										let newNotif = {
												time: new Date(),
								                message: this.props.fullName + ' ' + 'cancelled package',
								                body: ' ',
								                idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
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
							});
			let theArray = []
			
				database.ref('/processing/' + this.props.userId).once('value').then((snapshot) => {
					database.ref('/user/' + this.props.userId).set(snapshot.val()).then(() => {
						database.ref('/processing/' + this.props.userId).remove().then(() => {
							database.ref('/user/' + this.props.userId).update({
								purchased: false,
								usersGuide: '',
								charged: false,
								guideName: '',
								guideImage: '',
								startDate: null,
								guideOnJob: false,
								priceRange: [1700, 5000],
								apartmentType: 'Studio',
								type: 'client',
								cities: theArray,
								availability: theArray
							});
						})
					});
				}).then(() => {
					if (isCharged) {
						this.setState({
							cancelWarningModal: false
						})
						Actions.prepurchase({type: 'reset'})
					}
				})
			if (!isCharged) {
				this.setState({
					cancelModal: true
				})
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
		
    }
	removeModalAndRoute() {
		this.setState({
			cancelModal: false
		})

		Actions.prepurchase({type: 'reset'})
	}
	checkShowButton() {
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		if ((difference > 48 || difference < -48) && !isAfter) {
			return true
		}
	}
	checkShowButtonVersionTwo() {
		console.log(this.props.currentlySelectedDate)
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		if ((difference > 48 || difference < -48) && !isAfter) {
			return true
		}
	}
	checkIfAbleCancel() {
		if (this.props.version && this.props.version >= 2) {
			canCancel = this.checkShowButtonVersionTwo()
		} else {
			canCancel = this.checkShowButton()
		}
		
		if (canCancel) {
			this.setState({confirmCancelModal: true})
		} else {
			this.setState({
				cancelWarningModal: true
			})
		}
	}
	cancelPurchaseAndCharge() {
		this.setState({
			animating: true,
			cancelWarningModal: false
		})
		firebase.database().ref('/processing/' + this.props.userId).once('value').then(snapshot => {
		
			let charged = snapshot.val().charged
			if (!charged) {
				axios.post('https://smoove-api.herokuapp.com/api/chargeCustomer', {customerId: this.props.stripeToken, amount: this.props.purchasedPrice * 100}).then((response) => {
                            console.log(response);
							console.log('CHARGING')
                            if (response.data.status === "success") {
									this.setState({
										animating: false
									})
									this.cancelPurchase(true)
                                } else {
                                    setTimeout(() => {
										AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
									}, 1000)
                                }
                            })
			} else {
				this.cancelPurchase(true)
			}
		})
	}
	
	checkForShowDate() {
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		if ((difference > 48 || difference < -48) && !isAfter) {
			this.showPackage()
		}
	}
	getImageDimension() {
		if (width <= 321) {
			return 40
		} else {
			return 58
		}
	}
	getImageRadius() {
		if (width <= 321) {
			return 20
		} else {
			return 29
		}
	}
	checkForGuide() {
		if (this.props.guidesImage && this.props.guidesName) {
			return <View style = {{width: '100%', height: '23%', flex: 0, flexDirection: 'column', alignItems: 'center', marginTop: 20}} >
						<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '(rgb(61,61,61)', fontSize: 12, marginBottom: 10}}>Your guide is:</Text>
						<Image style = {{height: this.getImageDimension(),
							width: this.getImageDimension(),
							borderRadius: this.getImageRadius(),
							zIndex: 999}} source = {{uri: this.props.guidesImage}} />
						<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '(rgb(61,61,61)', fontSize: 25}}>{this.props.guidesName}</Text>
					</View>
		} else {
			return <View style = {{width: '100%', height: '23%', flex: 0, flexDirection: 'column', alignItems: 'center', marginTop: 20}} >
						<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '(rgb(61,61,61)', fontSize: 12, marginBottom: 10}}>Working to assign you a guide!</Text>
						<Image style = {{height: this.getImageDimension(),
							width: this.getImageDimension(),
							borderRadius: this.getImageRadius(),
							zIndex: 999}} source = {{uri: 'signup_placeholderimage'}} />
					</View>
		}
	}
	acceptPurchaseRoute() {
		this.setState({
			purchasedModal: false
		})
		setTimeout(() => {
			Actions.prepurchase();
		}, 1000)
	}
	
	mapVersion2Cities(cities) {
		return cities.map((city, i) => {
			
			return <Text key = {i} style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkForSmallScreenText(),
						color: '(rgb(61,61,61)',
						textAlign: 'left',
						marginLeft: 90,
						width: width
					}}> 
						• {' ' + city}
					</Text>
		})

	}
	getTopLocationMargin() {
		let cityArray = this.props.currentlySelectedCities;
		let theLength = cityArray.length
		return theLength * 10
	}
	version2Cities(cities) {
		return <View style = {{flex: 0, flexDirection: 'column', width: width, height: '100%', justifyContent: 'center', marginTop: this.getTopLocationMargin()}}>
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
	checkForDays() {
		let dayArray = this.props.currentlySelectedDays;
		if (dayArray && dayArray.length > 0) {
			if (dayArray.length > 1) {
				let dayArrayString = ''
				for (let i = 0, theLength = dayArray.length; i < theLength; i++) {
					if (this.props.version && this.props.version > 1) {
						//dayArrayString = dayArrayString + this.checkForDate(dayArray[i].date) + ' ' + this.checkForTimeBracket(dayArray[i].timeSlot) +',' + ' '
						return this.version2Days(dayArray)
					} else {
						dayArrayString = dayArrayString + this.checkForDate(dayArray[i].dayOfWeek) + ' ' + this.checkForTimeBracket(dayArray[i].time) +',' + ' '
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
	checkForMaxPrice(price) {
		if (price === 5000) {
			return 'No Max'
		} else {
			return '$' + price
		}
	}
	checkForDownwards() {
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		console.log(difference);
		console.log(isAfter);
		if ((difference > 48 || difference < -48) && !isAfter) {
			return <Image source = {require('../../assets/pin_downward.png')} />
		}
	}
	changeSelectedPackage(thePackage) {
		
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		console.log(difference);
		console.log(isAfter);
		if ((difference > 48 || difference < -48) && !isAfter) {
			this.props.changeSelectedPackage(thePackage)
		} else {
			AlertIOS.alert('Package already started')
		}
	}
	checkForDate(date) {
		console.log(date)
		if (date){
			let formattedDate = (moment(this.props.currentlySelectedDate).format('dddd, MMMM Do'));
			return formattedDate
		}
	}
	checkForDateText() {
		let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		console.log(difference);
		console.log(isAfter);
		if ((difference > 48 || difference < -48) && !isAfter) {
			return 'Update Package Selection'
		} else {
			return 'Close'
		}
	}
	checkForWhichPackageDesc() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <View style = {{flex: 0, height: 280, padding: 10, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text style = {{fontSize:23, fontFamily: 'PTSans-CaptionBold'}}> 3 </Text> </Text>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up and drop you</Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> off after viewing all apartments </Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									Our Guide will provide a folder which
							</Text>
							<Text style = {{fontSize: 13, marginLeft: -4,  fontFamily: 'PTSans-Caption', marginTop: 4}}>  contains information 
									on the area   </Text>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									you choose to live in.
							</Text>
						</View>
							
					</View>
		} else if (this.props.currentSelectedPackage === 'Premium') {
			return <View style = {{flex: 0, padding: 10, height: 280, justifyContent: 'space-around' ,flexDirection: 'column', width: '100%'}}>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text style = {{fontSize:23, fontFamily: 'PTSans-CaptionBold'}}> 5 </Text> </Text>
						<Text style = {{fontSize: 13, textAlign: 'left', fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Pre-paid SIM card </Text>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Airport pick up from LAX and drop off </Text>
							<Text style = {{fontSize: 13, marginLeft: 1, fontFamily: 'PTSans-Caption', marginTop: 4}}> limited to certain selected cities</Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up and drop you </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> off after viewing all apartments </Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									Our Guide will provide a folder which
							</Text>
							<Text style = {{fontSize: 13, marginLeft: -4,  fontFamily: 'PTSans-Caption', marginTop: 4}}>  contains information 
									on the area   </Text>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									you choose to live in.
							</Text>
						</View>
						
					</View>
		}
	}
	checkForListedPrices() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <View style = {{flex: 0, height: 50, justifyContent: 'flex-start', flexDirection: 'row'}}>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: 17, fontFamily: 'PTSans-CaptionBold'}}> {this.props.currentApartmentSelection} : </Text>
							<Text style = {{fontSize: 20, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> ${this.props.purchasedPrice}  </Text>
						</View>
						
					
						
					</View>
		} else if (this.props.currentSelectedPackage === 'Premium') {
			return <View style = {{flex: 0, height: 50, justifyContent: 'flex-start' ,flexDirection: 'row'}}>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: 17, fontFamily: 'PTSans-CaptionBold'}}> {this.props.currentApartmentSelection} : </Text>
							<Text style = {{fontSize: 25, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> ${this.props.purchasedPrice}  </Text>
						</View>
					</View>
		}
	}
	checkForPremium() {
		if (this.props.currentSelectedPackage === 'Premium') {
			return <Image source = {require('../../assets/icon_premiumpackage@3x.png')} />
		} else {
			return 
		}
	}
	checkForSmart() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <Image source = {require('../../assets/icon_smartpack@3x.png')} />
		} else {
			return 
		}
	}
	checkForTimeBracket(time) {
		if (time == 'morning') {
			return '9am - 1pm'
		} else if (time == 'afternoon') {
			return '1pm - 5pm'
		} else if (time == 'both') {
			return 'AM or PM'
		}
	}
	version2Days(days) {
		return <View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: width, height: '100%'}}>
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkForSmallScreenText(),
						color: '(rgb(61,61,61)',
						textAlign: 'left',
						marginLeft: 180,
						width: '100%'
					}}> 
						{this.formatDate(days[0])}
					</Text>
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkForSmallScreenText(),
						color: '(rgb(61,61,61)',
						textAlign: 'left',
						marginLeft: 180,
						width: '100%'
					}}> 
						{this.formatDate(days[1])}
					</Text>
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkForSmallScreenText(),
						color: '(rgb(61,61,61)',
						textAlign: 'left',
						marginLeft: 180,
						width: '100%'
					}}> 
						{this.formatDate(days[2])}
					</Text>
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkForSmallScreenText(),
						color: '(rgb(61,61,61)',
						textAlign: 'left',
						marginLeft: 180,
						width: '100%'
					}}> 
						{this.formatDate(days[3])}
					</Text>
					<Text style = {{
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
			let formattedDate =  '•' + ' ' + (moment(date.date).format('MMMM Do')) + ' ' + '|' + ' ' + this.checkForTimeBracket(date.timeSlot);
			return formattedDate
		}
	}
	changePackageAndHide() {
		if (packageIsHidden === false) {
			this.toggleSubviewTwo()
			setTimeout(() => {
				this.setState({
					showChangePackage: false
				})
			}, 500)
		}
	}
	showPackageDescriptions() {
		if (this.props.networkStatus != 'none') {
			if (packageIsHidden === true && this.state.showChangePackage === false) {
				this.setState({showChangePackage: true})
				this.toggleSubviewTwo()
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	showRequirements() {
		if (this.props.networkStatus != 'none') {
			if (this.state.showRequirements === false && packageIsHidden === true) {
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
			}, 500)
		}
	}
	checkScreenMainText() {
		if (width <= 321) {
			return 22
		} else {
			return 30
		}
	}
	getBottomTopMargin() {
		if (width <= 321) {
			return 175
		} else {
			return 120
		}
	}
	getTopMargin() {
		if (width <= 321) {
			return 0
		} else {
			return 15
		}
	}
	getTopContainerHeight() {
		if (width <= 321) {
			return 30
		} else {
			return 60
		}
	}
	checkForSmallScreenText() {
		if (width <= 321) {
			return 12
		} else {
			return 14
		}
	}





	render() {		
		var currentSavedDate = moment(this.props.currentlySelectedDate).format("dddd, MMMM Do");	
		
		return (
			<View style = {styles.containerStyle}>
				
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => setTimeout(() => { Actions.profile() }, 150)}>
						<Image style = {{height: 25, width: 30, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_profile.png')} />
					</TouchableOpacity>
					<Image style = {{width: 34, height: 34, marginBottom: 5, resizeMode: 'cover'}}source = {require('../../assets/nav_bar_logo.png')} />
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => setTimeout(() => { Actions.clientChat({typeOfChat: 'guide'})}, 150)}>
						<Image style = {{tintColor:'white', height: 25, width: 25, resizeMode: 'contain'}} source = {require('../../assets/icon_chat.png')} />
					</TouchableOpacity>
				</View>
				<View style = {{
					height: 406,
					flex: 0,
					width: '100%',
					justifyContent: 'space-around',
					alignItems: 'center',
					position: 'absolute',
					top: 65
				}}>
				<StatusBar
						backgroundColor="#bebebe"
						barStyle="light-content"
					/>
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
							
								<ActivityIndicator 
									size = "large"
									animating = {this.state.animating}
									color = "#fff"
								/>
							</View>
						</View>
				</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.cancelWarningModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.setState({confirmCancelModal: false})} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', height: 100, width: '100%', textAlign: 'center', top: 80, color: 'rgb(51,51,51)', fontSize: 16, fontFamily: 'PTSans-CaptionBold'}}>
																		According to the cancellation policy, your account will be charged in full. Are you sure you would like to cancel?
								</Text>
								<View style = {{flex: 0, flexDirection: 'row', justifyContent:'space-between', alignContent: 'center', alignItems: 'center', position: 'absolute', top: 192, width: 226, height: 40}}>
									<TouchableHighlight activeOpacity = {1} underlayColor = "rgba(68,149,203,100)" style = {{height: 40, width: 113, left: 0, borderRightWidth: 0.5, borderColor: '#fff', backgroundColor: 'rgba(68,149,203,100)', flex: -1, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.cancelPurchaseAndCharge()}>
										<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>Yes</Text>
									</TouchableHighlight>
									<TouchableHighlight activeOpacity = {1} underlayColor = "rgba(68,149,203,100)" style = {{height: 40, width: 113, flex: -1, backgroundColor: 'rgba(68,149,203,100)', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({cancelWarningModal: false})}>
										<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>No</Text>
									</TouchableHighlight>
								</View>
							</Image>
						</TouchableHighlight>
					</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showChangePackage}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.changePackageAndHide()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View style={[styles.secondSubView,
								{transform: [{translateY: this.state.bounceValueTwo}]}]}>
								<TouchableOpacity style = {{zIndex: 9999, position: 'absolute', top: 0, width: '110%', height: 44, flex: -0, justifyContent:'center',alignContent: 'center', alignItems: 'center', backgroundColor: 'rgb(68,149,203)'}} onPress = {() => this.changePackageAndHide()}>
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>Your package of preference</Text>
								</TouchableOpacity>
								<View style = {{flex: 0, width: '90%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: 100, marginTop: 50, flexDirection: 'row'}}>
									
										
										{this.checkForSmart()}
									
										
										{this.checkForPremium()}
									
								</View>
								<Hr lineColor = "rgb(151,151,151)" />
								{this.checkForWhichPackageDesc()}
								<Hr lineColor = "rgb(151,151,151)" />
								{this.checkForListedPrices()}

							</Animated.View>
						</TouchableHighlight>
				</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showRequirements}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.hideRequirements()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View style={[styles.secondSubView,
								{transform: [{translateY: this.state.bounceValueTwo}]}]}>
								<TouchableOpacity style = {{zIndex: 9999, position: 'absolute', top: 0, width: '110%', height: 44, flex: -0, justifyContent:'center',alignContent: 'center', alignItems: 'center', backgroundColor: 'rgb(68,149,203)'}} onPress = {() => this.hideRequirements()}>
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>Your Preferences</Text>
								</TouchableOpacity>
								<View style = {{flex: 0, width: '90%', paddingTop: 30, alignContent: 'center', alignItems: 'center', height: '100%', marginTop: 50, flexDirection: 'column'}}>
									<View style = {{
										flex:1,						
										flexDirection: 'column',
									}}>
										<Text style = {{fontSize: 16, textAlign: 'center', position: 'absolute', top: 0, width: width, zIndex: 9999999, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> Location(s) </Text>
										<Text style = {{fontFamily: 'PTSans-CaptionBold',
														fontSize: this.checkForSmallScreenText(),
														color: '(rgb(61,61,61)',
														width: width}}>
														{this.checkForCities()}
										</Text>
									</View>
									<Hr lineColor = "rgb(151,151,151)" />
									<View style = {{
										flex:1,
										
										flexDirection: 'column'
									}}>
										<Text style = {{fontSize: 16, textAlign: 'center', marginTop: 30, marginBottom: 10, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> Your Availability </Text>
										<Text style = {{fontFamily: 'PTSans-CaptionBold',
														fontSize: this.checkForSmallScreenText(),
														color: '(rgb(61,61,61)',
														width: width,
														paddingBottom: 3}}>
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
					visible={this.state.purchasedModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', top: 85, color: 'rgb(51,51,51)', fontSize: 20, fontFamily: 'PTSans-CaptionBold'}}>Congrats!</Text>
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 115, color: 'rgb(51,51,51)', fontSize: 14, fontFamily: 'PTSans-Caption'}}>
																		Your package was just completed!
								</Text>
								<TouchableOpacity style = {{height: 40, width: 226, flex: -1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 195}} onPress = {() => this.acceptPurchaseRoute()}>
									<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>OK</Text>
								</TouchableOpacity>
							</Image>
						</View>
					</Modal>
					<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.confirmCancelModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.setState({confirmCancelModal: false})} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 100, color: 'rgb(51,51,51)', fontSize: 20, fontFamily: 'PTSans-CaptionBold'}}>
																		Are you sure you would like to cancel?
								</Text>
								<View style = {{flex: 0, flexDirection: 'row', justifyContent:'space-between', alignContent: 'center', alignItems: 'center', position: 'absolute', top: 192, width: 226, height: 40}}>
									<TouchableHighlight activeOpacity = {1} underlayColor = "rgba(68,149,203,100)" style = {{height: 40, width: 113, left: 0, borderRightWidth: 0.5, borderColor: '#fff', backgroundColor: 'rgba(68,149,203,100)', flex: -1, justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.cancelPurchase()}>
										<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>Yes</Text>
									</TouchableHighlight>
									<TouchableHighlight activeOpacity = {1} underlayColor = "rgba(68,149,203,100)" style = {{height: 40, width: 113, flex: -1, backgroundColor: 'rgba(68,149,203,100)', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.setState({confirmCancelModal: false})}>
										<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>No</Text>
									</TouchableHighlight>
								</View>
							</Image>
						</TouchableHighlight>
					</Modal>
					<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.cancelModalTwo}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 100, color: 'rgb(51,51,51)', fontSize: 16, fontFamily: 'PTSans-Caption'}}>
																		Package successfully cancelled
								</Text>
								<TouchableOpacity style = {{height: 40, width: 226, flex: -1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 195}} onPress = {() => this.removeModalAndRoute()}>
									<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>OK</Text>
								</TouchableOpacity>
							</Image>
						</View>
					</Modal>
					<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.cancelModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', top: 85, color: 'rgb(51,51,51)', fontSize: 20, fontFamily: 'PTSans-CaptionBold'}}>Package Cancelled!</Text>
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 115, color: 'rgb(51,51,51)', fontSize: 16, fontFamily: 'PTSans-Caption'}}>
																		Your card will not be charged
								</Text>
								<TouchableOpacity style = {{height: 40, width: 226, flex: -1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 195}} onPress = {() => this.removeModalAndRoute()}>
									<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>OK</Text>
								</TouchableOpacity>
							</Image>
						</View>
					</Modal>
					<View style = {{marginTop: this.getTopMargin()}} />
					<Hr lineColor = "rgb(151,151,151)" textColor = "rgb(68,149,203)" text = "Apartment type" />
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkScreenMainText(),
						color: '(rgb(61,61,61)',
						height: this.getTopContainerHeight()
					}}>
						{this.props.currentApartmentSelection}
					</Text>
					<Hr lineColor = "rgb(151,151,151)" textColor = "rgb(68,149,203)" text = "Desired price" />
					<Text style = {{
						fontFamily: 'PTSans-CaptionBold',
						fontSize: this.checkScreenMainText(),
						color: '(rgb(61,61,61)',
						height: this.getTopContainerHeight()
					}}>
						${this.props.currentApartmentPrice[0]} - {this.checkForMaxPrice(this.props.currentApartmentPrice[1])}
					</Text>
					<View style = {{
						width: '100%',
						height: '50%',
						flex: 0,
						justifyContent: 'flex-start'
					}}>
						
						<View style = {{height: 0.5, width: '100%'}}>
								<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<TouchableOpacity onPress = {() => this.showRequirements()} style = {styles.rowStyle}>
							<Text style = {{fontFamily: 'PTSans-Caption', marginLeft: 10, color: '(rgb(61,61,61)', fontSize: 12}}> Requirements </Text>
							<Image style = {{marginRight: 10}} source = {require('../../assets/pin_downward.png')} />
						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
								<Hr lineColor = "rgb(207,205,205)" />
						</View>
					
						<TouchableOpacity style = {{width: '100%', paddingLeft: 10, height: 44, flex: 0, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}} onPress = {() => this.showPackageDescriptions()}>
							<Text style = {{fontFamily: 'PTSans-Caption', color: '(rgb(61,61,61)', fontSize: 12}}> Current Package </Text>
							<View style = {{flex: 0 , flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
								<Text style = {{fontFamily: 'PTSans-CaptionBold', marginRight: 10,color: '(rgb(61,61,61)', fontSize: 12}}>{this.props.currentSelectedPackage}</Text>
								<Image style = {{marginRight: 10}} source = {require('../../assets/pin_downward.png')} />
							</View>
						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
								<Hr lineColor = "rgb(207,205,205)" />
						</View>
						
					</View>
				</View>
				<View style = {{flex: 0, marginTop: this.getBottomTopMargin(), width: '100%',  flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent:'center'}}>
				<TouchableOpacity style = {{flex: 0,
					flexDirection: 'row',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'space-between',
					height: 44,
					
					backgroundColor: '#fff'}} onPress={() => Actions.suggestList()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_house@3x.png')} style = {{resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20, tintColor: 'black'}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Hotel Suggestions </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
					{this.checkForGuide()}
					</View>
				<TouchableOpacity onPress={() => this.checkIfAbleCancel()} style={styles.buttonStyle}>
                    <Text style={styles.textStyle}> 
                            Cancel Purchase
                    </Text>
                </TouchableOpacity>
			</View>
			);
	}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'space-around',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)',
		paddingTop: 65
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
		width:'49.9999%',
		height: '100%'
	},
	buttonStyle: {
		flex: 0,
		backgroundColor: 'rgba(255,21,0,0.5)',
		alignItems: 'center',
		justifyContent: 'center',
        width: '100%',
        height: 49,
		position: 'absolute',
		bottom: 0
	},
	textStyle: {
		color: '#fff',
		padding: 5,
		fontSize: 17,
		fontFamily: 'PTSans-Caption'
	},
	subView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 240, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
	},
	secondSubView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 500, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
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
		currentSelectedPackage: state.getStarted.currentSelectedPackage,
		userId: state.onboarding.userId,
		guidesName: state.getStarted.guidesName,
		fullName: state.getStarted.fullName,
		guidesImage: state.getStarted.guidesImage,
		stripeToken: state.getStarted.stripeToken,
		email: state.getStarted.email,
		networkStatus: state.guide.networkStatus,
		purchasedPrice: state.getStarted.purchasedPrice,
		version: state.getStarted.version
	};
};
export default connect(mapStateToProps, 
	{showModal, selectPremiumPackage, selectSmartPackage, saveUserInfo, changeSelectedPackage})(MainAfterPurchase);
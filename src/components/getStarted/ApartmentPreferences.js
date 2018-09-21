import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Slider, Image, DatePickerIOS, Modal, Animated, TouchableHighlight, Dimensions, StatusBar, AlertIOS} from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import ReactNativeComponentTree from'react-native/Libraries/Renderer/src/renderers/native/ReactNativeComponentTree';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import MultiSlider from 'react-native-multi-slider';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {apartmentPriceChanged, apartmentSelectionChanged, dateChanged, firstVisitComplete, dayChanged, saveRawDates} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height
var isHidden = true;
var firstIsHidden = true;
var calendarIsHidden = true;
var lowPrice = 1700
var highPrice = 5000

class ApartmentPreferences extends Component {
	constructor(props) {
        super(props);
		lowPrice = 1700
		highPrice = 5000
		if (this.props.firstVisit) {
			this.state = {
				showDatePicker: false,
				bounceValue: new Animated.Value(420),
				bounceValueTwo: new Animated.Value(500),
				bounceValueCalendar: new Animated.Value(height),
				firstVisit: true ,
				showCalendarPicker: false,
				showDaySelector: false,
				dateArrayRaw: [],
				currentDate: null,
				dateArray: []
			}
			this.toggleSubviewTwo()
		}
		else {
			this.state = {
				showDatePicker: false,
				bounceValue: new Animated.Value(240),
				bounceValueTwo: new Animated.Value(500),
				firstVisit: false,
				showCalendarPicker: false,
				showDaySelector: false,
				currentDate: null,
				dateArrayRaw: [],
				dateArray: []
			}
		}
		FCM.getFCMToken().then(token => {
			if (token) {
				firebase.database().ref('/user/' + this.props.userId).update({
					FCMToken: token
				})
			}
            // store fcm token in your server
        });

	}
	componentWillMount() {
		console.log("current seleted package ", this.props.currentSelectedPackage)
		lowPrice = this.props.currentApartmentPrice[0];
		highPrice = this.props.currentApartmentPrice[1];
	}
	changeApartmentPrice(value) {
		if (this.props.networkStatus != 'none') {
			this.props.apartmentPriceChanged(value);
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	changeApartmentPriceTemp(value) {

		if (this.props.networkStatus != 'none') {
			lowPrice = value[0]
			highPrice = value[1]
			this.setState({})
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	changeApartmentSelection(selection) {
		if (this.props.networkStatus != 'none') {
			this.props.apartmentSelectionChanged(selection);
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	dateChanged(date) {
		if (this.props.networkStatus != 'none') {
			this.props.dateChanged(date);
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	submitDate() {
		this.toggleSubview();
		setTimeout(() => {
			this.setState({
			showDatePicker: false
			})
		},500)

	}
	submitCalendarDates(event) {
		if (this.state.showCalendarPicker === true && !calendarIsHidden) {

				this.toggleSubviewCalendar();
				if (this.state.dateArray && this.state.dateArray[0] && this.state.dateArray[0].date) {
					this.props.dateChanged(this.state.dateArray[0].date);
				}
				setTimeout(() => {
					this.setState({
						showCalendarPicker: false
					})
				},500)

		}
	}
	submitPreferences() {
		if (this.props.networkStatus != 'none') {
			if (!this.props.version || this.props.version < 2) {
				if (!this.props.currentlySelectedDays || this.props.currentlySelectedDays.length === 0) {
					AlertIOS.alert(
							'Oops',
							'Please select availability.'
						)
				} else if (!this.props.currentlySelectedCities || this.props.currentlySelectedCities.length === 0) {
					AlertIOS.alert(
							'Oops',
							'Please select location.'
						)
				} else if (!this.props.currentlySelectedDate){
						AlertIOS.alert(
							'Oops',
							'Please select a start date.'
						)
					} else {

					let currentPrice = this.props.currentApartmentPrice;
					let database = firebase.database();
					if (this.props.comingFromCompleted) {

						database.ref('/completed/' + this.props.userId).update({
								package: this.props.currentSelectedPackage,
								startDate: this.props.currentlySelectedDate,
								cities: this.props.currentlySelectedCities,
								availability: this.props.currentlySelectedDays,
								apartmentType: this.props.currentlySelectedApartment,
								priceRange: currentPrice,
								comingFromCompleted: true
							})
					} else {
						database.ref('/user/' + this.props.userId).update({
								package: this.props.currentSelectedPackage,
								startDate: this.props.currentlySelectedDate,
								cities: this.props.currentlySelectedCities,
								availability: this.props.currentlySelectedDays,
								apartmentType: this.props.currentlySelectedApartment,
								priceRange: currentPrice
							});
						}



						if (this.props.buttonText === 'Update Preferences') {
							Actions.pop()
						} else {
							Actions.main()
						}
				}
			} else {
				let dateArray = this.state.dateArray
				if (!dateArray || dateArray.length === 0) {
					AlertIOS.alert(
							'Oops',
							'Please select availability dates.'
						)
				} else if (!this.props.currentlySelectedCities || this.props.currentlySelectedCities.length === 0) {
					AlertIOS.alert(
							'Oops',
							'Please select location.'
						)
				} else if (!dateArray){
						AlertIOS.alert(
							'Oops',
							'Please select a start date.'
						)
					} else {
					this.props.saveRawDates(this.state.dateArrayRaw)
					this.props.dayChanged(dateArray)
					let currentPrice = this.props.currentApartmentPrice;
					let database = firebase.database();

					if (this.props.comingFromCompleted) {

						database.ref('/completed/' + this.props.userId).update({
								package: this.props.currentSelectedPackage,
								startDate: dateArray[0].date,
								cities: this.props.currentlySelectedCities,
								availability: dateArray,
								apartmentType: this.props.currentlySelectedApartment,
								priceRange: currentPrice,
								comingFromCompleted: true
							})
					} else {
						database.ref('/user/' + this.props.userId).update({
								package: this.props.currentSelectedPackage,
								startDate: dateArray[0].date,
								cities: this.props.currentlySelectedCities,
								availability: dateArray,
								apartmentType: this.props.currentlySelectedApartment,
								priceRange: currentPrice
							});
						}



						if (this.props.buttonText === 'Update Preferences') {
							Actions.pop()
						} else {
							Actions.main()
						}

				}
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}

	}
	checkForMaxPrice(price) {
		if (price === 5000) {
			return 'No Max'
		} else {
			return '$' + price
		}
	}
	renderApartmentPrice() {
		if (this.props.currentApartmentPrice) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', fontSize: 20}}>${lowPrice} - {this.checkForMaxPrice(highPrice)}</Text>
		} else {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', fontSize: 20}}>$1700 - $5000</Text>
		}
	}
	checkForDate() {
		if (this.props.currentlySelectedDate) {
			let formattedDate = (moment(this.props.currentlySelectedDate).format('dddd, MMMM Do'));
			return formattedDate
		}

	}
	checkForCities() {
		let cityArray = this.props.currentlySelectedCities;
		if (cityArray) {
			if (cityArray.length > 1) {
				return cityArray[0] + '...'
			} else {
				return cityArray[0]
			}
		}
	}
	checkForDays() {
		let dayArray = this.props.currentlySelectedDays;

		if (dayArray == undefined) {
			dayArray = false
		}
		if (dayArray && dayArray.length > 0) {
			if (dayArray.length > 1) {
				if (dayArray && dayArray[0].time == 'morning') {
					return dayArray[0].dayOfWeek + ' ' + '9am - 1pm' + '...'
				} else if (dayArray){
					return dayArray[0].dayOfWeek + ' ' + '1pm - 5pm' + '...'
				}
			} else if (dayArray) {
				if (dayArray && dayArray[0].time == 'morning') {
					return dayArray[0].dayOfWeek + ' ' + '9am - 1pm'
				} else if (dayArray){
					return dayArray[0].dayOfWeek + ' ' + '1pm - 5pm'
				}
			}
		} else {
			return
		}
	}
	toggleSubview() {

		var toValue = 420;

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
	toggleSubviewCalendar() {

		var toValue = height;

		if(calendarIsHidden) {
		toValue = 0;
		}
		//This will animate the transalteY of the subview between 0 & 100 depending on its current state
		//100 comes from the style below, which is the height of the subview.
		Animated.spring(
		this.state.bounceValueCalendar,
		{
			toValue: toValue,
			velocity: 7,
			tension: 2,
			friction: 4,
		}
		).start();
		calendarIsHidden = !calendarIsHidden;
	}
	showDatePicker() {
		if (this.props.networkStatus != 'none') {
			this.setState({showDatePicker: !this.state.showDatePicker})
			this.toggleSubview()
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	showCalendarPicker() {
		if (this.props.networkStatus != 'none') {
			if (!this.state.showCalendarPicker && calendarIsHidden)
				this.setState({showCalendarPicker: true})
				this.toggleSubviewCalendar()
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	checkForMinText() {
		if (width <= 321) {
			return
		} else {
			return <Text style = {{fontFamily: 'PTSans-Caption', fontSize: 10, color: 'rgb(61,61,61)', paddingRight: 7, backgroundColor: 'transparent'}}>min</Text>
		}
	}
	checkForMaxText() {
		if (width <= 321) {
			return
		} else {
			return <Text style = {{fontFamily: 'PTSans-Caption', fontSize: 10, color: 'rgb(61,61,61)', paddingLeft: 7, backgroundColor: 'transparent'}}>max</Text>
		}
	}
	getSliderWidth() {
		if (width <= 321) {
			return '87%'
		} else {
			return '95%'
		}
	}
	hideFirstVisit() {
		firebase.database().ref('/user/' + this.props.userId).update({
							firstVisit: false
						});
		this.props.firstVisitComplete()
		this.toggleSubviewTwo()
		setTimeout(() => {
			this.setState({
				firstVisit: false
			})
		}, 300)
	}
	toggleSubviewTwo() {

		var toValue = 500;

		if(firstIsHidden) {
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
		firstIsHidden = !firstIsHidden;
	}

	getVersion() {
		if (this.props.version >= 2) {
			return <View style = {{flex: 0, width: '100%', height: null, justifyContent: 'space-between'}}>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<TouchableOpacity style = {styles.bottomListItem} onPress={() => setTimeout(() => { Actions.locationSelector() },170)}>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}> Set Location </Text>
							<View style = {{flex: -1, height: '100%', alignContent: 'center', alignItems: 'center', justifyContent:'flex-end', flexDirection: 'row'}}>
								<View style = {{flex: -1, flexDirection: 'row'}}>
									<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)', marginRight: 10, alignContent: 'flex-end', paddingLeft: 10, flexWrap: 'wrap', flex: -1}}> {this.checkForCities()} </Text>
								</View>
								<Image source = {require('../../assets/icon_arrow.png')} />
							</View>
						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<View style = {{backgroundColor: '#3d3d3d', height: 44, marginTop: 10, flex: 0, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
							<Text style = {{
								fontFamily: 'PTSans-Caption',
								color: '#fff',
								fontSize: 12,
								paddingLeft: 5,
								paddingRight: 5,
								wordWrap: 'wrap',
								textAlign: 'center'
							}}>
								Select the dates you are available to view apartments
							</Text>
						</View>
						<View style = {{flex: 0, width: '100%', height: 60, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
							<TouchableOpacity style = {{
								width: '100%',
								backgroundColor: '#fff',
								height: 55,
								flex: 0,
								flexDirection: 'row',
								alignContent: 'center',
								alignItems: 'center',
								justifyContent: 'center',
							}} onPress = {() => this.showCalendarPicker()}>
								<Image source = {require('../../assets/icon_calendar@3x.png')} style = {{marginRight: 10}}/>
								<Text style = {{color: 'rgba(68,149,203,100)', fontSize: 20, fontFamily: 'PTSans-CaptionBold'}}>Availability Dates</Text>
								<Image source = {require('../../assets/icon_blue_arrow@3x.png')} style = {{position: 'absolute', right: 20}}/>
							</TouchableOpacity>
						</View>
					</View>
		} else {
			return <View style = {{flex: 0, width: '100%', height: null, justifyContent: 'space-between'}}>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<TouchableOpacity style = {styles.bottomListItem} onPress={() => setTimeout(() => { Actions.locationSelector() },170)}>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}> Set Location </Text>
							<View style = {{flex: -1, height: '100%', alignContent: 'center', alignItems: 'center', justifyContent:'flex-end', flexDirection: 'row'}}>
								<View style = {{flex: -1, flexDirection: 'row'}}>
									<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)', marginRight: 10, alignContent: 'flex-end', paddingLeft: 10, flexWrap: 'wrap', flex: -1}}> {this.checkForCities()} </Text>
								</View>
								<Image source = {require('../../assets/icon_arrow.png')} />
							</View>
						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<TouchableOpacity style = {styles.bottomListItem} onPress={() => setTimeout(() => { Actions.daySelector() },170)}>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}> Set Availability Days </Text>
							<View style = {{flex: -1, height: '100%', alignContent: 'center', alignItems: 'center', justifyContent:'flex-end', flexDirection: 'row'}}>
								<View style = {{flex: -1, flexDirection: 'row'}}>
									<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)', marginRight: 10, alignContent: 'flex-end', paddingLeft: 10, flexWrap: 'wrap', flex: -1}}> {this.checkForDays()} </Text>

								</View>
								<Image source = {require('../../assets/icon_arrow.png')} />
							</View>

						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
						<TouchableOpacity style={{width: '100%', paddingLeft: 10, paddingRight: 10, height: 44, flex: 0, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}
										onPress={() => this.showDatePicker()}>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}> Available From </Text>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}>{this.checkForDate()}</Text>
						</TouchableOpacity>
						<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
					</View>
		}
	}
	hideDaySelector() {
		this.toggleSubview()
		this.setState({
			showDaySelector: false,
			currentDate: null
		})
		this.setState({
			showCalendarPicker: true
		})
	}
	choseMorning() {
		this.toggleSubview()
		let currentDateArray = this.state.dateArray
		let currentRawArray = this.state.dateArrayRaw
		let newDate = {
			date: this.state.currentDate,
			timeSlot: 'morning'
		}
		currentRawArray.push(this.state.currentDate)
		currentDateArray.push(newDate)
		currentDateArray.sort(function(a, b) {
			a = new Date(a.date);
			b = new Date(b.date);
			return a>b ? -1 : a<b ? 1 : 0;
		});
		currentDateArray.reverse()
		this.setState({
			showDaySelector: false,
			dateArrayRaw: currentRawArray,
			dateArray: currentDateArray,
			currentDate: null
		})
		this.setState({
			showCalendarPicker: true
		})
	}
	choseAfternoon() {
		this.toggleSubview()
		let currentDateArray = this.state.dateArray
		let currentRawArray = this.state.dateArrayRaw
		let newDate = {
			date: this.state.currentDate,
			timeSlot: 'afternoon'
		}
		currentRawArray.push(this.state.currentDate)
		currentDateArray.push(newDate)
		currentDateArray.sort(function(a, b) {
			a = new Date(a.date);
			b = new Date(b.date);
			return a>b ? -1 : a<b ? 1 : 0;
		});
		currentDateArray.reverse()
		this.setState({
			showDaySelector: false,
			dateArrayRaw: currentRawArray,
			dateArray: currentDateArray,
			currentDate: null
		})
		this.setState({
			showCalendarPicker: true
		})
	}
	choseBoth() {
		this.toggleSubview()
		let currentDateArray = this.state.dateArray
		let currentRawArray = this.state.dateArrayRaw
		let newDate = {
			date: this.state.currentDate,
			timeSlot: 'both'
		}
		currentRawArray.push(this.state.currentDate)
		currentDateArray.push(newDate)
		currentDateArray.sort(function(a, b) {
			a = new Date(a.date);
			b = new Date(b.date);
			return a>b ? -1 : a<b ? 1 : 0;
		});
		currentDateArray.reverse()
		this.setState({
			showDaySelector: false,
			dateArrayRaw: currentRawArray,
			dateArray: currentDateArray,
			currentDate: null
		})
		this.setState({
			showCalendarPicker: true
		})
	}
	onDateChange(date) {


		let rawArray = this.state.dateArrayRaw
		let dateArray = this.state.dateArray
		let index = null
		let alreadySelected = false
		uniqueRawArray = rawArray.filter(function(item, pos) {
			return rawArray.indexOf(item) == pos;
		})

		for (let i = 0, theLength = dateArray.length; i < theLength; i++) {
          if (date.getTime() === dateArray[i].date.getTime()) {
            alreadySelected = true
			index = i
          }
        }

		if (!alreadySelected && uniqueRawArray && uniqueRawArray.length > 4) {
			AlertIOS.alert('Oops', 'Can only select up to five days.')
		} else if (alreadySelected) {
			 uniqueRawArray = rawArray.filter(function(item, pos) {
				return rawArray.indexOf(item) == pos;
			})
			 uniqueRawArray.splice(index, 1)
			 dateArray.splice(index, 1)
			 dateArray.sort(function(a, b) {
				a = new Date(a.date);
				b = new Date(b.date);
				return a>b ? -1 : a<b ? 1 : 0;
			});
			dateArray.reverse()
			 this.setState({
				dateArray: dateArray,
				dateArrayRaw: uniqueRawArray
			 })

		} else {
			this.toggleSubview()
			this.setState({
				showDaySelector: true,
				currentDate: date
			})
			this.setState({
				showCalendarPicker: false
			})
		}
	}
	getInitialDate() {
		let rawArray = this.state.dateArrayRaw
		if (this.state.dateArrayRaw && rawArray.length > 0) {
			endIndex = rawArray.length
			return rawArray[endIndex - 1]
		} else {
			return new Date
		}
	}
	getTimeSlot(time) {
		if (time == 'morning') {
			return 'Morning 9am - 1pm'
		} else if (time == 'afternoon') {
			return 'Afternoon 1pm - 5pm'
		} else {
			return 'AM or PM'
		}
	}
	formatDate(date) {
		if (date && date.date) {
			let formattedDate =  '•' + ' ' + (moment(date.date).format('MMMM Do')) + ' ' + '|' + ' ' + this.getTimeSlot(date.timeSlot);
			return formattedDate
		}
	}
	getFirstDate() {
		let dateArray = this.state.dateArray
		if (dateArray[0]) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', borderWidth: 2, borderColor: '#3d3d3d', width: '100%', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center', marginRight: 30, paddingTop: 8}}>{this.formatDate(dateArray[0].date)}</Text>
		}
	}
	getSecondDate() {
		let dateArray = this.state.dateArray
		if (dateArray[1]) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center', marginRight: 30, paddingTop: 8}}>{this.formatDate(dateArray[1].date)}</Text>
		}
	}
	getThirdDate() {
		let dateArray = this.state.dateArray
		if (dateArray[2]) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center', marginRight: 30, paddingTop: 8}}>{this.formatDate(dateArray[2].date)}</Text>
		}
	}
	getFourthDate() {
		let dateArray = this.state.dateArray
		if (dateArray[3]) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center', marginRight: 30, paddingTop: 8}}>{this.formatDate(dateArray[3].date)}</Text>
		}
	}
	getFifthDate() {
		let dateArray = this.state.dateArray
		if (dateArray[4]) {
			return <Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center', marginRight: 30, paddingTop: 8}}>{this.formatDate(dateArray[4].date)}</Text>
		}
	}
	checkForSelectedDateText(dateArray) {
		if (dateArray && dateArray.length > 0) {
			return 'Selected Dates and Times'
		}
	}
	render() {
console.log('###################', this.props.currentlySelectedApartment)
		return (
			<View style = {styles.containerStyle}>
				<StatusBar
						backgroundColor="#bebebe"
						barStyle="light-content"
					/>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity onPress = {() => Actions.onboardContainer({from: 'MAIN_VIEW'})} style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Apt. Request </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => Actions.clientChat({typeOfChat: 'guide'})}>
						<Image style = {{tintColor:'white', height: 25, width: 25, resizeMode: 'contain'}} source = {require('../../assets/icon_chat.png')} />
					</TouchableOpacity>
				</View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={false}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.hideFirstVisit()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View style={[styles.secondSubView,
								{transform: [{translateY: this.state.bounceValueTwo}]}]}>
								<TouchableOpacity style = {{zIndex: 9999, position: 'absolute', top: 0, width: '110%', height: 44, flex: -0, justifyContent:'center',alignContent: 'center', alignItems: 'center', backgroundColor: 'rgb(68,149,203)'}} onPress = {() => this.hideFirstVisit()}>
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>Close</Text>
								</TouchableOpacity>
								<Image source = {require('../../assets/Description_Preferences@3x.png')} style = {{width: '100%'}}/>


							</Animated.View>
						</TouchableHighlight>
				</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showDatePicker}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.submitDate()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View style={[styles.subView,
								{transform: [{translateY: this.state.bounceValue}]}]}>
								<TouchableOpacity style = {{zIndex: 9999, position: 'absolute', top: 0, width: '110%', height: 44, flex: -0, justifyContent:'flex-end', backgroundColor: 'rgba(61, 61, 61, 100)'}} onPress = {() => this.submitDate()}>
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'right', height: '100%', marginRight: 30, paddingTop: 8}}>Done</Text>
								</TouchableOpacity>
								<DatePickerIOS
								style={{ height: 196, backgroundColor: '#fff', width: '100%', paddingLeft: 10, paddingRight: 10, position: 'absolute', bottom: 0, zIndex: 999}}
								date={new Date(this.props.currentlySelectedDate)} onDateChange={(date) => this.dateChanged(date)}
								mode="date"
								minimumDate = {new Date()}/>

							</Animated.View>
						</TouchableHighlight>
				</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showDaySelector}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.hideDaySelector()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', zIndex: 999999, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View
								style={[styles.subViewDaySelector,
								{transform: [{translateY: this.state.bounceValue}]}]}
							>
								<View style = {{height:39,
												backgroundColor: '#4495CB',
												width: '100%',
												padding: 15,
												flex: 0,
												alignItems: 'center',
												justifyContent: 'center',
												position: 'absolute',
												top:0}}>
									<Text style = {styles.headTextStyle}>
										Select the time slot you are available
									</Text>
								</View>
								<TouchableOpacity style = {{width: '100%', flex: 1, marginTop: 39, alignItems: 'center', justifyContent: 'center'}} onPress = {() => this.choseMorning()}>
									<Text style = {{fontFamily: 'PTSans-Caption',
													fontSize: 17,
													color: 'rgb(61,61,61)'}}>
													Morning: 9am - 1pm
									</Text>
								</TouchableOpacity>
								<View style = {{height: 0.5, width: '100%'}}>
									<Hr lineColor = "rgb(207,205,205)" />
								</View>
								<TouchableOpacity style = {{width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress = {() => this.choseAfternoon()}>
									<Text style = {{fontFamily: 'PTSans-Caption',
													fontSize: 17,
													color: 'rgb(61,61,61)'}}>
													Afternoon: 1pm - 5pm
									</Text>
								</TouchableOpacity>
								<View style = {{height: 0.5, width: '100%'}}>
									<Hr lineColor = "rgb(207,205,205)" />
								</View>
								<TouchableOpacity style = {{width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress = {() => this.choseBoth()}>
									<Text style = {{fontFamily: 'PTSans-Caption',
													fontSize: 17,
													color: 'rgb(61,61,61)'}}>
													AM or PM
									</Text>
								</TouchableOpacity>
							</Animated.View>
						</TouchableHighlight>
					</Modal>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showCalendarPicker}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {(e) => this.submitCalendarDates(e)} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 9, backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View style={[styles.subViewCalendar,
								{transform: [{translateY: this.state.bounceValueCalendar}]}]}>
								<View key = "done" style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
									<TouchableOpacity onPress = {() => console.log('pressed')} style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}}>
										<View />
									</TouchableOpacity>
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Select Dates </Text>
									<TouchableOpacity key = "done" style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => this.submitCalendarDates()}>
										<Text key = "done" style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18, backgroundColor: 'rgba(0,0,0,0)'}}>Done</Text>
									</TouchableOpacity>
								</View>
								<TouchableHighlight onPress = {(e) => console.log('inner')} underlayColor = "rgba(0,0,0,0)" activeOpacity = {1} style = {{flex: 1, marginTop: 65}}>
								<View style = {{flex: 1, flexDirection: 'column', alignContent: 'flex-start', paddingTop: 20}}>

									<CalendarPicker
										onDateChange={this.onDateChange.bind(this)}
										minDate = {new Date}
										selectedDayColor = 'rgba(68,149,203,100)'
										selectedDayTextColor = '#fff'
										allowRangeSelection = {true}
										datesSelected = {this.state.dateArray}
										initialDate = {this.getInitialDate()}
									/>

									<TouchableHighlight onPress = {(e) => console.log('inner')} underlayColor = "rgba(0,0,0,0)" activeOpacity = {1} style = {{flex: 1}}>
									<View style = {{
										marginTop: 10,
										height: 200
									}}>
										<Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 13, textAlign: 'center', color: 'rgba(68,149,203,100)', backgroundColor: 'rgba(0,0,0,0)', }}>Select up to 5 dates</Text>
										<Text style = {{fontFamily: 'PTSans-CaptionBold', width: '100%', fontSize: 17, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0)', }}>{this.checkForSelectedDateText(this.state.dateArray)}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',  marginLeft: '5%', textAlign: 'left', marginTop: 5}}>{this.formatDate(this.state.dateArray[0])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',  marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[1])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',  marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[2])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',  marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[3])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',  marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[4])}</Text>
									</View>
									</TouchableHighlight>


								</View>
								</TouchableHighlight>
							</Animated.View>
						</TouchableHighlight>
				</Modal>
				<View style = {{
					height: 406,
					flex: 0,
					width: '100%',
					justifyContent: 'space-around',
					alignItems: 'center'
				}}>
					<Hr lineColor = "rgb(151,151,151)" textColor = "rgb(68,149,203)" text = "Set apartment type" />
					<View style = {{flex: 0, width: 256, height: 29}}>
						<SegmentedControls
							options={['Studio', '1 Bedroom', '2 Bedroom']}
							onSelection={(selection) => this.changeApartmentSelection(selection)}
							selectedOption={this.props.currentlySelectedApartment}
							tint= {'rgba(68,149,203,100)'}
							backTint = {'rgb(244,244,244)'}
							optionContainerStyle = {{width: 256, height: 29}}
							optionStyles={{fontFamily: 'PTSans-Caption'}}
						/>
					</View>

					<Hr lineColor = "rgb(151,151,151)" textColor = "rgb(68,149,203)" text = "Set your desired price" />
					{this.renderApartmentPrice()}
					<View style = {{flex: 0, width: this.getSliderWidth(), flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center'}}>
						{this.checkForMinText()}

							<MultiSlider
								values = {this.props.currentApartmentPrice}
								min = {1700}
								max = {5000}
								step = {100}
								containerStyle={{
									height:2
								}}
								trackWidth = {220}
								trackStyle={{
									height:2,
									backgroundColor: 'rgb(68,149,203)',
									width: 220
								}}
								selectedStyle = {{
									backgroundColor: 'rgb(68,149,203)'
								}}
								onValuesChangeFinish={this.changeApartmentPrice.bind(this)}
								onValuesChange={this.changeApartmentPriceTemp.bind(this)}
							/>
						{this.checkForMaxText()}

					</View>
					{this.getVersion()}
				</View>

				<LargeButton onPress={() => this.submitPreferences()}>
					Create Request
				</LargeButton>
			</View>
			);
	}
}
const getHeadTextSize = () => {
	if (width <= 321) {
			return 12
		} else {
			return 14
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
	sliderStyle: {
		width: '80%'
	},
	subView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 240, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
	},
	subViewCalendar: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: height, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, zIndex: 1
	},
	bottomListItem: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		height: 44,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10
	},
	subViewDaySelector: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 420, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 0, zIndex: 999999
	},
	secondSubView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 500, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
	},
	headTextStyle: {
		color: '#fff',
		textAlign: 'center',
		fontFamily: 'PTSans-Caption',
		fontSize: getHeadTextSize(),
		width: '100%'
	}
};

const mapStateToProps = (state) => {
	return {
		currentApartmentPrice: state.getStarted.currentApartmentPrice,
		currentlySelectedDate: state.getStarted.currentlySelectedDate,
		firstVisit: state.getStarted.firstVisit,
		currentlySelectedCities: state.getStarted.currentlySelectedCities,
		currentlySelectedDays: state.getStarted.currentlySelectedDays,
		currentSelectedPackage: state.getStarted.currentSelectedPackage,
		currentlySelectedApartment: state.getStarted.currentApartmentSelection,
		userId: state.onboarding.userId,
		comingFromCompleted: state.getStarted.comingFromCompleted,
		networkStatus: state.guide.networkStatus,
		version: state.getStarted.version
	};
};
export default connect(mapStateToProps,
	{apartmentPriceChanged, apartmentSelectionChanged, saveRawDates, dateChanged, dayChanged, firstVisitComplete}
	)(ApartmentPreferences);
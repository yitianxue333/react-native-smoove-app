import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Slider, Image, DatePickerIOS, Modal, AlertIOS, Animated, TouchableHighlight, Dimensions} from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import MultiSlider from 'react-native-multi-slider';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment'
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {apartmentPriceChanged, apartmentSelectionChanged, dateChanged, changeSelectedPackage} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var isHidden = true
var packageIsHidden = true
var calendarIsHidden = true;
var width = Dimensions.get('window').width
var height = Dimensions.get('window').height
var lowPrice = 1700
var highPrice = 5000

class EditPurchase extends Component {
	constructor(props) {
        super(props);
        this.state = {
            showDatePicker: false,
			bounceValue: new Animated.Value(240),
			bounceValueTwo: new Animated.Value(500),
			bounceValueCalendar: new Animated.Value(height),
			showChangePackage: false,
			showCalendarPicker: false,
			showDaySelector: false,
			dateArrayRaw: this.props.dateArrayRaw || [],
			currentDate: null,
			dateArray: this.props.currentlySelectedDays || []
        }
    }
	componentDidMount() {
		let holdingArray = []
		let currentArray = this.state.dateArray
		for (let i = 0, theLength = currentArray.length; i < theLength; i++) {
			holdingArray.push(new Date(currentArray[i].date))
		}
		for (let i = 0, theLength = currentArray.length; i < theLength; i++) {
			if (new Date > new Date(currentArray[i])) {
				currentArray.splice(i, 1)
			}
			this.setState({
				dateArray: currentArray
			})
		}
		this.setState({
			dateArrayRaw: holdingArray
		})
		lowPrice = this.props.currentApartmentPrice[0];
		highPrice = this.props.currentApartmentPrice[1];
		console.log(this.state.dateArrayRaw)
	}
	changeSelectedPackage(thePackage) {
		this.props.changeSelectedPackage(thePackage)
	}
	checkForShowDate() {
		/*let nowDate = moment().format();
		let savedDate = moment(this.props.currentlySelectedDate).format();
		let difference = moment(nowDate).diff(savedDate, 'hours');
		let isAfter = moment(nowDate).isAfter(savedDate);
		console.log(difference);
		console.log(isAfter);
		if ((difference > 48 || difference < -48) && !isAfter) {*/
			this.showPackage()
		//}
	}
	checkForPremium() {
		if (this.props.currentSelectedPackage === 'Premium') {
			return <Image source = {require('../../assets/icon_checkmark.png')} style = {{height: 30, width: 30, resizeMode: 'contain'}}/>
		} else {
			return <View style = {{height: 30, width: 30}}/>
		}
	}
	checkForSmart() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <Image source = {require('../../assets/icon_checkmark.png')} style = {{height: 30, width: 30, resizeMode: 'contain'}}/>
		} else {
			return <View style = {{height: 30, width: 30}}/>
		}
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
	submitCalendarDates(e) {
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
					AlertIOS.alert('Oops', 'Please select availability.')
				} else if (!this.props.currentlySelectedCities || this.props.currentlySelectedCities.length === 0) {
					AlertIOS.alert('Oops', 'Please select location.')
				} else {
					let currentPrice = this.props.currentApartmentPrice;
					let database = firebase.database();
							database.ref('/user/' + this.props.userId).update({
								package: this.props.currentSelectedPackage,
								startDate: this.props.currentlySelectedDate,
								cities: this.props.currentlySelectedCities,
								availability: this.props.currentlySelectedDays,
								apartmentType: this.props.currentlySelectedApartment,
								priceRange: currentPrice
							});
					
						if (this.props.buttonText === 'Update Preferences') {
							Actions.pop()
						} else {
							Actions.main()
						}	
					}
				} else {
					let dateArray = this.state.dateArray
					console.log(dateArray)
					if (!dateArray || dateArray.length === 0 || !dateArray[0] || !dateArray[0].date) {
						AlertIOS.alert(
								'Oops',
								'Please select availability dates.'
							)
					} else if (!this.props.currentlySelectedCities || this.props.currentlySelectedCities.length === 0) {
						AlertIOS.alert('Oops', 'Please select location.')
					} else {
						let currentPrice = this.props.currentApartmentPrice;
						let database = firebase.database();
								database.ref('/user/' + this.props.userId).update({
									package: this.props.currentSelectedPackage,
									startDate: dateArray[0].date,
									dateArrayRaw: this.state.dateArrayRaw,
									cities: this.props.currentlySelectedCities,
									availability: dateArray,
									apartmentType: this.props.currentlySelectedApartment,
									priceRange: currentPrice
								});
						
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
		console.log("prices = ", this.props.currentApartmentPrice);
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
		console.log(dayArray)
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
	showCalendarPicker() {
		console.log(this.state)
		if (this.props.networkStatus != 'none') {
			if (!this.state.showCalendarPicker && calendarIsHidden) {
				this.setState({showCalendarPicker: !this.state.showCalendarPicker})
				this.toggleSubviewCalendar()
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
	}
	changePackageAndHide() {
		if (packageIsHidden === false) {
			firebase.database().ref('/user/' + this.props.userId).update({
				package: this.props.currentSelectedPackage,
			})
			this.toggleSubviewTwo()
			setTimeout(() => {
				this.setState({
					showChangePackage: false
				})
			}, 500)
		}
	}
	checkForDownwards() {	
		return <Image source = {require('../../assets/pin_downward.png')} />
	}
	showPackage() {
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
						<TouchableOpacity style = {styles.bottomListItem} onPress={() => setTimeout(() => { this.showPackage() },170)}>
							<Text style = {{fontFamily: 'PTSans-Caption', fontSize: 12, color: 'rgb(61,61,61)'}}> Current Package </Text>
							<View style = {{flex: 0 , flexDirection: 'row', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
								<Text style = {{fontFamily: 'PTSans-CaptionBold', marginRight: 10,color: '(rgb(61,61,61)', fontSize: 12}}>{this.props.currentSelectedPackage}</Text>
								<Image source = {require('../../assets/pin_downward.png')} />
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
	checkForWhichPackageDesc() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <View style = {{flex: 0, height: 250, justifyContent: 'space-around', flexDirection: 'column', width: '100%'}}>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text style = {{fontSize:23, fontFamily: 'PTSans-CaptionBold'}}> 3 </Text> </Text>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up and drop you off </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> after viewing all apartments </Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									Our Guide will provide a folder which
							</Text>
							<Text style = {{fontSize: 13, marginLeft: -4, fontFamily: 'PTSans-Caption', marginTop: 4}}>  contains information 
									on the area   </Text>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									you choose to live in.
							</Text>
						</View>
						
					</View>
		} else if (this.props.currentSelectedPackage === 'Premium') {
			return <View style = {{flex: 0, height: 250, justifyContent: 'space-around' ,flexDirection: 'column', width: '100%'}}>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption'}}> Total apartments to view: <Text style = {{fontSize:23, fontFamily: 'PTSans-CaptionBold'}}> 5 </Text> </Text>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Hotel Suggestions </Text>
						<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Pre-paid SIM card </Text>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Airport pick up from LAX and drop off </Text>
							<Text style = {{fontSize: 13, marginLeft: 1, fontFamily: 'PTSans-Caption', marginTop: 4}}> limited to certain selected cities</Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> Our Guide will pick you up and drop you off</Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-Caption', marginTop: 4}}> after viewing all apartments </Text>
						</View>
						<View>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									Our Guide will provide a folder which
							</Text>
							<Text style = {{fontSize: 13, marginLeft: -4, fontFamily: 'PTSans-Caption', marginTop: 4}}>  contains information 
									on the area   </Text>
							<Text style = {{fontSize: 13, marginLeft: 3, fontFamily: 'PTSans-Caption', marginTop: 4}}> 
									you choose to live in.
							</Text>
						</View>
						
					</View>
		}
	}
	checkForScreenSizeText() {
		if (width <= 321) {
			return 10
		} else {
			return 13
		}
	}
	checkForListedPrices() {
		if (this.props.currentSelectedPackage === 'Smart') {
			return <View style = {{flex: 0, height: 40, width: '100%', justifyContent: 'space-around', flexDirection: 'row'}}>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> Studio:  </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $199  </Text>
						</View>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> 1-Bedroom:  </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $249  </Text>
						</View>
						<View style = {{flex: -1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> 2-Bedroom: </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $349  </Text>
						</View>
					</View>
		} else if (this.props.currentSelectedPackage === 'Premium') {
			return <View style = {{flex: 0, height: 40, width: '100%', justifyContent: 'space-around' ,flexDirection: 'row'}}>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> Studio: </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $499  </Text>
						</View>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> 1-Bedroom: </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $549  </Text>
						</View>
						<View style = {{flex: -1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }}>
							<Text style = {{fontSize: this.checkForScreenSizeText(), fontFamily: 'PTSans-CaptionBold'}}> 2-Bedroom: </Text>
							<Text style = {{fontSize: 13, fontFamily: 'PTSans-CaptionBold', color: 'rgb(68,149,203)'}}> $599  </Text>
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
		console.log(this.state.dateArray)
        
		let rawArray = this.state.dateArrayRaw
		let dateArray = this.state.dateArray
		let index = null
		let alreadySelected = false
		uniqueRawArray = rawArray.filter(function(item, pos) {
			return rawArray.indexOf(item) == pos;
		})
		console.log(dateArray)
		for (let i = 0, theLength = dateArray.length; i < theLength; i++) {
          if (date.getTime() === new Date(dateArray[i].date).getTime()) {
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
	checkForSelectedDateText(dateArray) {
		if (dateArray && dateArray.length > 0) {
			return 'Selected Dates and Times'
		}
	}
	formatDate(date) {
		if (date && date.date) {
			let formattedDate =  '•' + ' ' + (moment(date.date).format('MMMM Do')) + ' ' + '|' + ' ' + this.getTimeSlot(date.timeSlot);
			return formattedDate
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
	render() {
		console.log(this.props);
		
		return (
			<View style = {styles.containerStyle}>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_close.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Apt. Request </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => Actions.clientChat({typeOfChat: 'guide'})}>
						<Image style = {{tintColor:'white', height: 25, width: 25, resizeMode: 'contain'}} source = {require('../../assets/icon_chat.png')} />
					</TouchableOpacity>
				</View>
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
									<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>Update your package of preference</Text>
								</TouchableOpacity>
								<View style = {{flex: 0, width: '90%', justifyContent: 'space-around', height: 100, marginTop: 50, flexDirection: 'row'}}>
									<TouchableOpacity onPress = {() => this.changeSelectedPackage('Smart')} style = {{flex: 0, flexDirection: 'row', height: 44, width: '40%'}}>
										<Image source = {require('../../assets/icon_smartpack@3x.png')} />
										{this.checkForSmart()}
									</TouchableOpacity>
									<TouchableOpacity onPress = {() => this.changeSelectedPackage('Premium')} style = {{flex: 0, flexDirection: 'row', height: 44, width: '40%'}}>
										<Image source = {require('../../assets/icon_premiumpackage@3x.png')} />
										{this.checkForPremium()}
									</TouchableOpacity>
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
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',   marginLeft: '5%', textAlign: 'left', marginTop: 5}}>{this.formatDate(this.state.dateArray[0])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',   marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[1])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',   marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[2])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',   marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[3])}</Text>
										<Text style = {{fontFamily: 'PTSans-Caption', width: '100%', fontSize: 15, backgroundColor: 'rgba(0,0,0,0)',   marginLeft: '5%', textAlign: 'left',marginTop: 5}}>{this.formatDate(this.state.dateArray[4])}</Text>
									</View>
									</TouchableHighlight>
									

								</View>
								</TouchableHighlight>
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
					Update Request
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
	secondSubView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 500, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
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
	subViewCalendar: {
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center', 
		height: height, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, zIndex: 1
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
		currentlySelectedCities: state.getStarted.currentlySelectedCities,
		currentlySelectedDays: state.getStarted.currentlySelectedDays,
		currentSelectedPackage: state.getStarted.currentSelectedPackage,
		currentlySelectedApartment: state.getStarted.currentApartmentSelection,
		userId: state.onboarding.userId,
		networkStatus: state.guide.networkStatus,
		version: state.getStarted.version,
		dateArrayRaw: state.getStarted.dateArrayRaw
	};
};
export default connect(mapStateToProps, 
	{apartmentPriceChanged, apartmentSelectionChanged, dateChanged, changeSelectedPackage}
	)(EditPurchase);
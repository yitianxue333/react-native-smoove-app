import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, StatusBar, Modal, Animated, TouchableHighlight, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {dayChanged} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var isHidden = true
var width = Dimensions.get('window').width

class DaySelector extends Component {
	componentWillMount() {
		this.state = {
			showModal: false,
			initialOptions: [],
			bounceValue: new Animated.Value(196)
		}
	}
	componentDidMount() {
		this.getInitialSelection()
	}
	componentWillUnmount() {
		Actions.refresh()
	}
	checkForArrow(day) {
		let currentDayArray = this.state.initialOptions
		if (currentDayArray && currentDayArray.length > 0) {
			var indexOfDay;
			for(let i = 0; i < currentDayArray.length; i += 1) {	
				if(currentDayArray[i].dayOfWeek === day) {
					indexOfDay = i;
					break;
				} else {
					indexOfDay = -1;
				}
			}
			if (indexOfDay != -1) {
				let arrowImage = require('../../assets/icon_checkmark.png');
				return <Image source = {arrowImage} style = {{height: 20, resizeMode: 'contain'}}/>;
			} else {
				return;
			}
		}
	}
	dayChanged(day) {
		let currentDayArray = this.props.currentlySelectedDays;
	
		if (currentDayArray && currentDayArray.length > 0) {
			var indexOfDay;
			for(let i = 0; i < currentDayArray.length; i += 1) {
				console.log(currentDayArray[i].dayOfWeek)
				console.log(day)
				if(currentDayArray[i].dayOfWeek === day) {
					console.log(i)
					currentDayArray.splice(i, 1);
					
					if (currentDayArray) {
						this.props.dayChanged(currentDayArray);
						this.setState({
							initialOptions: currentDayArray
						})
					} else {
						this.props.dayChanged([]);
						this.setState({
							initialOptions: []
						})
					}
					indexOfDay = i;
					console.log(this.props.currentlySelectedDays)
					return;
				} else {
					indexOfDay = -1;
				}
			}
		
			
			if(indexOfDay !== -1) {
				currentDayArray.splice(indexOfDay, 1);
				this.props.dayChanged(currentDayArray);
			}
			else {
				this.setState({
					showModal: true,
					currentDay: day
				})
				this.toggleSubview()
			}
		} else {
				this.setState({
					showModal: true,
					currentDay: day
				})
				this.toggleSubview()
			}
	}
	getInitialSelection() {
		let currentDayArray = this.props.currentlySelectedDays;
		if (currentDayArray) {
			this.setState({initialOptions: currentDayArray});
		} else {
				this.setState({initialOptions: []});
			}
	}
	hideDaySelector() {
		let currentDayArray = this.props.currentlySelectedDays
		this.toggleSubview()
		setTimeout(() => {
			this.setState({
				showModal: false,
				currentDay: ''
			})
		}, 500)
	}
	choseAfternoon() {
		this.toggleSubview()
		let day = {
					dayOfWeek: this.state.currentDay,
					time: 'afternoon'
				}
		let currentDayArray = this.props.currentlySelectedDays;
		if (currentDayArray) {
			currentDayArray = [...currentDayArray, day];
		} else {
			currentDayArray = [day]
		}
		this.props.dayChanged(currentDayArray);
		this.setState({
							initialOptions: currentDayArray
						})
		setTimeout(() => {
			this.setState({
				showModal: false,
				currentDay: ''
			})
		}, 300)
	}
	choseMorning() {
		this.toggleSubview()
		let day = {
					dayOfWeek: this.state.currentDay,
					time: 'morning'
				}
		let currentDayArray = this.props.currentlySelectedDays;
		if (currentDayArray) {
			currentDayArray = [...currentDayArray, day];
		} else {
			currentDayArray = [day]
		}
		this.props.dayChanged(currentDayArray);
		this.setState({
							initialOptions: currentDayArray
						})
		setTimeout(() => {
			this.setState({
				showModal: false,
				currentDay: ''
			})
		}, 300)
		
	}
	toggleSubview() {    

		var toValue = 196;

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

	render() {
		return (
			<View style = {styles.containerStyle}>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop({refresh: {test: true}})}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Set Day </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.showModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => this.hideDaySelector()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Animated.View
								style={[styles.subView,
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
							</Animated.View>
						</TouchableHighlight>
					</Modal>
				<View style = {styles.headStyle}>
					<Text style = {styles.headTextStyle}>
						Select the days you are available
					</Text>
				</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Monday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Monday
				</Text>{this.checkForArrow('Monday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Tuesday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Tuesday
				</Text>{this.checkForArrow('Tuesday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Wednesday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Wednesday
				</Text>{this.checkForArrow('Wednesday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Thursday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Thursday
				</Text>{this.checkForArrow('Thursday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Friday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'center',
						backgroundColor: 'transparent'}}
				>
						Friday
				</Text>{this.checkForArrow('Friday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Saturday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Saturday
				</Text>{this.checkForArrow('Saturday')}</TouchableOpacity>
				<View style = {{height: 0.5, width: '100%'}}>
							<Hr lineColor = "rgb(207,205,205)" />
						</View>
				<TouchableOpacity onPress = {() => this.dayChanged('Sunday')} style = {{flex: 0, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', height: 60}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto',
						backgroundColor: 'transparent'}}
				>
						Sunday
				</Text>{this.checkForArrow('Sunday')}</TouchableOpacity>
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
		justifyContent:'flex-start',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)',
		paddingTop: 65
	},
	multiPicker: {
		width: '100%',
		height: '100%',
		marginTop: 5
	},
	headStyle: {
		height:39,
		backgroundColor: '#4495CB',
		width: '100%',
		padding: 15,
		flex: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	headTextStyle: {
		color: '#fff',
		textAlign: 'center',
		fontFamily: 'PTSans-Caption',
		fontSize: getHeadTextSize(),
		width: '100%'
	},
	subView: {
		flex: 0, alignItems: 'center', justifyContent: 'space-around', height: 196, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 0
	}
};
const mapStateToProps = (state) => {
	return {
		currentlySelectedDays: state.getStarted.currentlySelectedDays
	};
};
export default connect(mapStateToProps, 
	{dayChanged}
	)(DaySelector);
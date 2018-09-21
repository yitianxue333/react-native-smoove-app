import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, StatusBar, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import MultipleChoice from 'react-native-multiple-choice';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {cityChanged} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var width = Dimensions.get('window').width

class LocationSelector extends Component {
	componentWillMount() {
		this.state = {
			initialOptions: []
		}
	}
	componentDidMount() {
		this.getInitialSelection()
	}
	componentWillUnmount() {
		Actions.refresh()
	}
	getInitialSelection() {
		let currentDayArray = this.props.currentlySelectedCities;
		setTimeout(() => {
			if (currentDayArray) {
			let arrayOfOptions = [];
			for(let i = 0; i < currentDayArray.length; i += 1) {
				arrayOfOptions.push(currentDayArray[i])
			}
			this.setState({initialOptions: arrayOfOptions});
		} else {
				this.setState({initialOptions: []});
			}
		}, 100)
		
	}
	useGreenCheck() {
		let arrowImage = require('../../assets/icon_checkmark.png');
		return <Image source = {arrowImage} style = {{height: 20, resizeMode: 'contain'}}/>;
	}
	cityChanged(city) {
		let currentCityArray = this.props.currentlySelectedCities;
		if (currentCityArray) {
			let indexOfCity = currentCityArray.indexOf(city);
			console.log(indexOfCity);
			if(indexOfCity !== -1) {
				currentCityArray.splice(indexOfCity, 1);
				this.props.cityChanged(currentCityArray);
			}
			else {
				currentCityArray = [...currentCityArray, city];
				this.props.cityChanged(currentCityArray);
			}
		} else {
				currentCityArray = [city];
				this.props.cityChanged(currentCityArray);
		}
	}
	getTextCellHeight() {		
		if (width <= 321) {
				return 34
			} else {
				return 44
			}
	}
	renderText(option) {
		return <View style = {{flex: 0, height: '100%',  justifyContent: 'center', height: this.getTextCellHeight()}}><Text style = {{
						fontFamily: 'PTSans-Caption', 
						fontSize: 15, 
						color: 'rgb(61,61,61)', 
						marginLeft: 20, 
						textAlignVertical: 'auto'}}
				>
						{option}
				</Text></View>
	}
	render() {
		console.log(this.state.initialOptions)
		return (
			<View style = {styles.containerStyle}>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop({refresh: {test: true}})}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Select City </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<View style = {styles.headStyle}>
					<Text style = {styles.headTextStyle}>
						Select one city, or multiple cities you would{'\n'}like to live
					</Text>
				</View>
				<MultipleChoice
					options={[
						'Brentwood, CA',
						'Culver City, CA',
						'Downtown LA, CA',
						'Marina Del Rey, CA',
						'Mar Vista, CA',
						'Palms Area, CA',
						'Santa Monica, CA',
						'Venice, CA',
						'Westwood, CA'		
					]}
					selectedOptions = {this.state.initialOptions}
					onSelection={(option) => this.cityChanged(option)}
					style = {styles.multiPicker}
					renderText = {(option) => this.renderText(option)}
					renderIndicator = {this.useGreenCheck.bind(this)}
				
				/>
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

const getMultiSize = () => {
	if (width <= 321) {
			return '60%'
		} else {
			return '100%'
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
		height: getMultiSize(),
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
	}
};
const mapStateToProps = (state) => {
	return {
		currentlySelectedCities: state.getStarted.currentlySelectedCities
	};
};
export default connect(mapStateToProps, 
	{cityChanged}
	)(LocationSelector);
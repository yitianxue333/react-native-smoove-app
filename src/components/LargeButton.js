import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

checkForAdmin = (isAdmin, radius) => {
	if (isAdmin) {
		return {
			flex: 1,
			backgroundColor: 'rgba(61, 61, 61, 100)',
		}
	} else if (radius){
		return {
					flex: 1,
					backgroundColor: 'rgba(68,149,203,100)',
					borderRadius: radius
				}
		}
		else {
			return {
				flex: 1,
				backgroundColor: 'rgba(68,149,203,100)'
			}
		}
	}

getViewStyle = (props) => {
	if (props.radius) {
		return {
			width: '100%',
			height: 45,
			borderRadius: props.radius
		}
	} else {
		return {
			width: '100%',
			height: 45
		}
	}
}

checkForTextStyle = (size) => {
	if (size) {
		return {
			alignSelf: 'center',
			color: '#fff',
			fontSize: size,
			paddingTop: 10,
			paddingBottom: 10,
			fontFamily: 'PTSans-CaptionBold',
			letterSpacing: 2
		}
	} else {
		return {
			alignSelf: 'center',
			color: '#fff',
			fontSize: 16,
			paddingTop: 10,
			paddingBottom: 10,
			fontFamily: 'PTSans-CaptionBold',
			letterSpacing: 2
		}
	}
}

const LargeButton = (props) => {
	
	return (
		<View style = {styles.viewStyle}>
			<TouchableOpacity onPress={props.onPress} style={this.checkForAdmin(props.isAdmin, props.radius)}>
				<Text style={this.checkForTextStyle(props.fontSize)}> 
					{props.children}
				</Text>
			</TouchableOpacity>
		</View>
		);
};

const styles = {
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		paddingTop: 10,
		paddingBottom: 10,
		fontFamily: 'PTSans-CaptionBold',
		letterSpacing: 2
	},
	viewStyle: {
		width: '100%',
		height: 45
	}
};

export default LargeButton;
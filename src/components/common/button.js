import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Button = (props) => {
	return (
		<View style = {styles.viewStyle}>
			<TouchableOpacity onPress={props.onPress} style={styles.buttonStyle}>
				<Text style={{
					alignSelf: 'center',
					color: props.textColor,
					fontSize: 16,
					fontFamily: 'PTSans-CaptionBold',
					letterSpacing: 2
				}}> 
					{props.children}
				</Text>
			</TouchableOpacity>
		</View>
		);
};

const styles = {
	buttonStyle: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0)',
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#fff',
		marginLeft: 5,
		marginRight: 5,
		alignItems: 'center',
		justifyContent: 'center', 
		alignContent: 'center'
	},
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		fontFamily: 'PTSans-CaptionBold',
		letterSpacing: 2
	},
	viewStyle: {
		width: '80%',
		height: '7%'
	}
};

export { Button };
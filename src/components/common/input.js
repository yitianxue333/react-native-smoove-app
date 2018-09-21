import React from 'react';
import { TextInput, View, Text } from 'react-native';

const checkForLabel = (label) => {
	if (label) {
		return <Text style = {styles.labelStyle}>{label}</Text>
	} else {
		return;
	}
}
const checkForStyle = (style) => {
	if (style) {
		return {height:40,
			flex: 1,
			flexDirection:'row',
			alignItems:'center',
			borderBottomWidth: 0,
			backgroundColor: '#fff',
			padding: 0,
			borderRadius: style,
			borderWidth: 1,
			borderColor: '#3d3d3d'};
	} else {
		return {
			height:40,
			flex: 1,
			flexDirection:'row',
			alignItems:'center',
			borderBottomWidth: 0,
			backgroundColor: '#fff',
			padding: 10
		}
	}
}

const Input = (props) => {
	const { inputStyle, labelStyle, containerStyle } = styles;

	return (
		<View style = {checkForStyle(props.inputRadius)}> 
			{checkForLabel(props.label)}
			<TextInput
				placeholder={props.placeholderText}
				autoCorrect={false}
				style = {inputStyle}
				value={props.value}
				autoFocus = {props.focus}
				onChangeText={props.onChangeText}
				secureTextEntry = {props.secureTextEntry}
				keyboardType = {props.numeric || 'default'}
				maxLength = {props.maxLength}
				autoCapitalize = {props.capitalize}
				placeholderTextColor = 'rgb(209, 210, 212)'
			/>
		</View>
		);
};

const styles = {
	inputStyle: {
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 12,
		lineHeight: 23,
		flex: 2,
		letterSpacing: 2,
		fontFamily: 'PTSans-Caption'
	},
	labelStyle: {
		fontSize: 12,
		paddingLeft: 10,
		flex: 1,
		color:'#d3d3d3',
		fontFamily: 'PTSans-Caption',
		letterSpacing: 2
	},
	containerStyle: {
		height:40,
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		borderBottomWidth: 0,
		backgroundColor: '#fff',
		padding: 10
	}
};

export { Input };
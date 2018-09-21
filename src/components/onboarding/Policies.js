import React, {Component} from 'react';
import {Text, View, StatusBar} from 'react-native';
import {Actions} from 'react-native-router-flux';

class Policies extends Component {
	render() {
		return (
			<View style = {styles.containerStyle}>
				<Text>Policies PDF goes here</Text>
			</View>
			);
	}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'flex-start',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)'
	}
};

export default Policies
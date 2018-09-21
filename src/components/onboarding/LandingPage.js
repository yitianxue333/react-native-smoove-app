import React, {Component} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';


class LandingPage extends Component {
	componentWillMount() {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log(user)
			} else {
				console.log('nobody signed in')
			}
			});
	}
	render() {
		return (
			<Image style = {styles.backgroundImageStyle} source = {require('../../assets/loading_screen.png')}>
				<TouchableOpacity onPress={() => {Actions.mainBucket()}}>
					
				</TouchableOpacity>
			</Image>
			);
	}
}

const styles = {
	backgroundImageStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'center',
		width:null,
		height:null,
		backgroundColor:'rgba(0,0,0,0)'
	}
};
export default LandingPage;
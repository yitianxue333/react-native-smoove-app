import React, {Component, AsyncStorage} from 'react';
import {Image, Text, TouchableOpacity, View, KeyboardAvoidingView, Dimensions, StatusBar, WebView, PushNotificationIOS, ActivityIndicator, Modal, AlertIOS} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import dismissKeyboard from 'react-native-dismiss-keyboard'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';


var width = Dimensions.get('window').width
class TermsOfService extends Component {
	
	
	render() {

		return (
			<View style = {styles.containerStyle}>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Terms of Service </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<WebView style = {{height: 100, width: width}} source={{uri: 'SmooveTOUUsersNew.pdf'}}/>
			</View>
			);
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
	textfieldContainerStyle: {
		backgroundColor: '#fff',
		width: '100%',
		height: 88.5,
		borderTopWidth: 0.5,
		borderTopColor: 'rgb(190, 190, 190)',
		borderBottomColor: 'rgb(190, 190, 190)',
		borderBottomWidth: 0.5,
		marginTop: 30
	},
	helperTextStyle: {
		color:'rgb(90, 93, 96)',
		fontSize:10,
		width: '100%',
		textAlign: 'center',
		fontFamily: 'PTSans-CaptionBold',
		marginTop: 30
	}
};

export default TermsOfService
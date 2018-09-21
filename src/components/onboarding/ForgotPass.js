import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, KeyboardAvoidingView, TouchableHighlight, StatusBar, AlertIOS, Modal, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {emailChanged} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var width = Dimensions.get('window').width

class ForgotPass extends Component {
	componentWillMount() {
		this.state = {
			forgotPassModal: false
		}
	}
	onEmailChange(text) {
		this.props.emailChanged(text);
	}
	sendForgotPassEmail() {
		dismissKeyboard()
		if (this.props.networkStatus != 'none') {
			if (!this.props.email) {
				AlertIOS.alert('Oops', 'Please enter a valid email.')
			} else {
			let currentProps = this.props;
			let trimmedEmail = currentProps.email;
			trimmedEmail = trimmedEmail.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
				firebase.auth().sendPasswordResetEmail(trimmedEmail).then((response) => {
					this.props.emailChanged('');
					this.setState({
						forgotPassModal: true
					})
				})
				.catch((err) => {
					
					if (err.code == 'auth/user-not-found') {
						AlertIOS.alert('Oops', "Couldn't locate your account, please try again.")
					} else {
						AlertIOS.alert('Oops', 'Something went wrong. Please try again.')
					}
				});
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
		
	}
	hideKeyboardPop(){
		dismissKeyboard()
		Actions.pop()
	}
	getTopMargin() {
		if (width <= 321) {
			return 200
		} else {
			return 300
		}
	}
	render() {

		return (
			<KeyboardAvoidingView style = {styles.containerStyle} behavior = "padding">
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Forgot Password </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.forgotPassModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<TouchableHighlight onPress = {() => Actions.pop()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>

							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
		
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 85, color: 'rgb(51,51,51)', fontSize: 14, fontFamily: 'PTSans-Caption'}}>
																		Password reset email has been sent, {'\n'}please check your inbox
								</Text>
								<TouchableOpacity style = {{height: 40, width: 226, flex: -1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 195}} onPress={() => { 
										this.setState({
											forgotPassModal: false
										})
										Actions.pop();
								}}>
									<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>OK</Text>
								</TouchableOpacity>
							</Image>
						</TouchableHighlight>
					</Modal>
				<StatusBar
				     backgroundColor="#bebebe"
				     barStyle="light-content"
			   />
			   <View style = {{
				   width: '100%',
				   height: this.getTopMargin(),
				   flex: 0,
				   flexDirection: 'column',
				   alignContent: 'center',
				   justifyContent: 'center'
			   }}
			   >
					<View style = {styles.textfieldContainerStyle}>
						<Input 
							placeholderText = "Email"
							onChangeText={this.onEmailChange.bind(this)}
							value = {this.props.email}
							focus = {true}
							capitalize = "none"
							numeric = 'email-address'
							/>
					</View>
					<Text style = {styles.helperTextStyle}>
						Enter your email and we will send you a link to get back in your{'\n'}account.
					</Text>
				</View>
				<LargeButton onPress={() => this.sendForgotPassEmail()}>
					Reset Password
				</LargeButton>
			</KeyboardAvoidingView>
			);
	}
}

const getCellHeight = () => {
	if (width <= 321) {
		return 34
	} else {
		return 44
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
		height: getCellHeight(),
		borderTopWidth: 0.5,
		borderTopColor: 'rgb(190,190,190)',
		borderBottomColor: 'rgb(190,190,190)',
		borderBottomWidth: 0.5,
	},
	helperTextStyle: {
		color:'rgb(90, 93, 96)',
		fontSize:10,
		width: '100%',
		textAlign: 'center',
		fontFamily: 'PTSans-CaptionBold',
		marginTop:30
	}
};
const mapStateToProps = (state) => {
	return {
		email: state.onboarding.email,
		networkStatus: state.guide.networkStatus
	};
};
export default connect(mapStateToProps, 
	{emailChanged}
	)(ForgotPass);
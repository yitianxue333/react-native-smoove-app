import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, KeyboardAvoidingView, StatusBar, ActivityIndicator, Dimensions, Modal, AlertIOS} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import firebase from 'firebase';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer'
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');
import {Actions} from 'react-native-router-flux';
import {nameChanged, emailChanged, passwordChanged, validatePassChanged, userUploadedPhoto, saveUserId, showError, saveUserInfo} from '../../actions';
import {Input} from '../common';
import LargeButton from '../LargeButton'
import dismissKeyboard from 'react-native-dismiss-keyboard'

var width = Dimensions.get('window').width

class SignUp extends Component {
	componentWillMount() {
		this.state = {
			animating: false,
			profileImage: 'signup_placeholderimage'
		}
		firebase.auth().signOut()
		this.props.passwordChanged('');
		this.props.emailChanged('');
		this.props.nameChanged('');
		this.props.validatePassChanged('');
	}
	onNameChange(text) {
		this.props.nameChanged(text);
	}
	onEmailChange(text) {
		this.props.emailChanged(text);
	}
	onPasswordChange(text) {
		this.props.passwordChanged(text);
	}
	onValidatePassChange(text) {
		this.props.validatePassChanged(text);
	}
	validatePassAndCreateAccount() {
		
		if (this.props.networkStatus != 'none') {
			let currentProps = this.props;
			if (!currentProps.fullName) {
				AlertIOS.alert(
					"Oops",
					"Please enter your full name"
				)
			} else if (!this.props.password) {
					AlertIOS.alert(
						"Oops",
						"Please enter a valid password"
					)
				} else if (currentProps.password === currentProps.validatePassword) {
				let trimmedEmail = currentProps.email;
				this.setState({
					animating: true
				})
				trimmedEmail = trimmedEmail.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
				if (trimmedEmail !== '') {
					firebase.auth().createUserWithEmailAndPassword(trimmedEmail, currentProps.password).then((response) => {
						let currentImageToSend = '';
						if (this.state.profileImage === 'signup_placeholderimage') {
							currentImageToSend = 'https://firebasestorage.googleapis.com/v0/b/smoove-94fc6.appspot.com/o/signup_placeholderimage.png?alt=media&token=f9dd72b1-a5a0-47f1-8e5c-3d7a9526bbfa'
						} else {
							currentImageToSend = currentProps.profileImage
						}
						let database = firebase.database();
						console.log("selected package3", this.props.currentSelectedPackage)
						database.ref('/user/' + response.uid).set({
							usersId: response.uid,
							fullName: currentProps.fullName,
							email: currentProps.email,
							package: this.props.currentSelectedPackage?this.props.currentSelectedPackage:'Smart',
							profileImage: currentImageToSend,
							priceRange: [1700, 5000],
							apartmentType: 'Studio',
							version: 2,
							type: 'client',
							cities: [],
							firstVisit: true,
							availability: [],
							tutorialComplete: false
						});
						database.ref('/messages/' + response.uid).set({
							userId: response.uid,
							adminMessages: [],
							guideMessages: [],
							clientIsWatching: false,
							adminIsWatching: false
						});
						firebase.database().ref('/user/' + response.uid).once('value').then((snapshot) => {
								this.props.saveUserInfo(snapshot.val());
						});
						this.props.saveUserId(response.uid);
						this.setState({
							animating: false
						})
						Actions.tutorial();
					})
					.catch((err) => {
						console.log(err);
						this.setState({
							animating: false
						})
						setTimeout(() => {
							if (err.code == 'auth/invalid-email') {
								AlertIOS.alert(
									"Oops",
									"Please enter a valid email address."
								)
							} else {
								AlertIOS.alert(
									"Oops",
									err.code
								)
							}
						}, 1000)
					});
				} else {
					AlertIOS.alert(
						"Oops",
						"Please enter a valid email address."
					)
				}
			} else {
				AlertIOS.alert(
					"Oops",
					"The password entered did not match. Please try again."
				)
				this.setState({
						animating: false
					})
			}
		} else {
			setTimeout(() => {
				AlertIOS.alert(
					"Oops",
					'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.'
				)
			}, 1000)
		}
		
	}
	showImagePicker() {
		if (this.props.networkStatus != 'none') {
			ImagePicker.showImagePicker(null, (response) => {
			// console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let source = response;
				console.log(ImageResizer);
				ImageResizer.createResizedImage(source.uri, 300, 300, 'JPEG', 80).then((resizedImageUri) => {
						// resizeImageUri is the URI of the new image that can now be displayed, uploaded...
									console.log(resizedImageUri)
									const file = {
										// `uri` can also be a file system path (i.e. file://)
										uri: resizedImageUri,
										name: source.uri,
										type: "image/jpeg"
									}

									const options = {
										keyPrefix: "",
										bucket: "smooveassets",
										region: "us-east-1",
										accessKey: "AKIAJMFZV25TZ2BXOM3Q",
										secretKey: "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",
										successActionStatus: 201
									}
									this.setState({
										profileImage: source.uri
									})
									this.props.userUploadedPhoto(source.uri)
									RNS3.put(file, options).then(response => {
									if (response.status !== 201)
										throw new Error("Failed to upload image to S3");
										this.props.userUploadedPhoto(response.body.postResponse.location)
									
									}).catch((err) => {
										AlertIOS.alert(
											"Oops",
											err
										)
									})
				}).catch((err) => {
						AlertIOS.alert(
							"Oops",
							err
						)
				});
			}
			});
		} else {
			AlertIOS.alert(       //////////////
					"Oops",
					"Please enter your full name"
				)
			setTimeout(() => {
				alert('Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
		
	}
	hideKeyboardPop(){
		dismissKeyboard()
		Actions.pop()
	}
	getTopMargin() {
		if (width <= 321) {
			return 125
		} else {
			return 175
		}
	}
	render() {

		return (
			<KeyboardAvoidingView behavior = "padding" style = {styles.containerStyle}>
				<View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Sign Up </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.animating}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<View style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', height: '50%', width: '80%', backgroundColor: 'transparent'}}>
								<ActivityIndicator 
									size = "large"
									animating = {this.state.animating}
									color = "#fff"
								/>
							</View>
						</View>
					</Modal>
				<StatusBar
				     backgroundColor="#bebebe"
				     barStyle="light-content"
			   />
				<TouchableOpacity onPress={() => this.showImagePicker()} style = {{flex: 0, flexDirection: 'column', alignItems: 'center'}}>
					<Image source = {{uri: this.state.profileImage}} style = {styles.placeholderImage}/>
				</TouchableOpacity>
				<View style = {{
				   width: '100%',
				   height: 200,
				   flex: 0,
				   flexDirection: 'column',
				   alignContent: 'center',
				   justifyContent: 'flex-start',
				   position: 'absolute',
				   top: this.getTopMargin()
			   }}
			   >
					<View style = {styles.textfieldContainerStyle}>
						<Input 
							placeholderText = "Full Name" 
							onChangeText={this.onNameChange.bind(this)}
							value = {this.props.fullName}
							focus = {true}
							capitalize = "words"
							/>
						<View style = {{height: 0.5, width: '100%', paddingLeft: 4, paddingRight: 4}}>
							<Hr lineColor = "rgb(190,190,190)" />
						</View>
						<Input 
							placeholderText = "Email"
							onChangeText={this.onEmailChange.bind(this)}
							value = {this.props.email}
							capitalize = "none"
							numeric = 'email-address'
							/>
						<View style = {{height: 0.5, width: '100%', paddingLeft: 4, paddingRight: 4}}>
							<Hr lineColor = "rgb(190,190,190)" />
						</View>
						<Input 
							placeholderText = "Password"
							onChangeText={this.onPasswordChange.bind(this)}
							value = {this.props.password}
							secureTextEntry
							/>
						<View style = {{height: 0.5, width: '100%', paddingLeft: 4, paddingRight: 4}}>
							<Hr lineColor = "rgb(190,190,190)" />
						</View>
						<Input 
							placeholderText = "Confirm Password" 
							onChangeText={this.onValidatePassChange.bind(this)}
							value = {this.props.validatePassword}
							secureTextEntry
							/>
					</View>
					<View style = {{width: '100%', flex: 0, flexDirection: 'column', marginTop: 10}}>
						<Text style = {styles.helperTextStyle}>
							By creating an account you are agreeing to our 
								<TouchableOpacity style = {{height: 10, width: 90, flex: 0, flexDirection: 'row', backgroundColor: 'transparent'}}onPress={() => Actions.termsOfService()}>
									<Text style = {{color: 'rgba(68,149,203,100)', fontSize: 10, zIndex: 9999}}>
											{" "}Terms{" "}	
											
								
							of Service </Text></TouchableOpacity>	
							{'\n'}and 
								<TouchableOpacity style = {{height: 11, marginTop: 1, width: 90, flex: 0, flexDirection: 'row', backgroundColor: 'transparent'}}onPress={() => Actions.privacyPolicy()}>
									<Text style = {{color: 'rgba(68,149,203,100)', fontSize: 10}}>
										{" "}Privacy Policy.
									</Text>
								</TouchableOpacity>
						</Text>
					</View>
				</View>
				<LargeButton onPress={() => this.validatePassAndCreateAccount()}>
					Sign Up
				</LargeButton>
			</KeyboardAvoidingView>
			);
	}
}

const checkForImageSize = () => {
	if (width <= 321) {
		return {
			height: 50,
			width: 50,
			borderRadius: 25,
			marginTop: 5
		}
	} else {
		return {
			height: 70,
			width: 70,
			borderRadius: 35,
			marginTop: 20
		}
	}
}

const checkForTextfieldSize = () => {
	if (width <= 321) {
		return 145
	} else {
		return 176
	}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent: 'space-between',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)',
		paddingTop: 65
	},
	placeholderImage: checkForImageSize(),
	textfieldContainerStyle: {
		backgroundColor: '#fff',
		width: '100%',
		height: checkForTextfieldSize(),
		borderTopWidth: 0.5,
		borderTopColor: 'rgb(190,190,190)',
		borderBottomColor: 'rgb(190,190,190)',
		borderBottomWidth: 0.5
	},
	helperTextStyle: {
		color:'rgb(90,93,96)',
		fontSize:10,
		width: '100%',
		textAlign: 'center'
	}
};
const mapStateToProps = (state) => {
	return {
		fullName: state.onboarding.fullName,
		email: state.onboarding.email,
		password: state.onboarding.password,
		validatePassword: state.onboarding.validatePassword,
		profileImage: state.getStarted.profileImage,
		errorText: state.onboarding.errorText,
		networkStatus: state.guide.networkStatus,
		currentSelectedPackage: state.getStarted.currentSelectedPackage,
	};
};
export default connect(mapStateToProps, 
	{nameChanged, emailChanged, passwordChanged, validatePassChanged, userUploadedPhoto, saveUserId, saveUserInfo, showError}
	)(SignUp);
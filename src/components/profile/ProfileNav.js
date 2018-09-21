import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Slider, Image, DatePickerIOS, Dimensions, AlertIOS, Animated, Modal, TouchableHighlight} from 'react-native';
import { SegmentedControls } from 'react-native-radio-buttons'
import {connect} from 'react-redux';
import ImageResizer from 'react-native-image-resizer'
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');
var Mailer = require('NativeModules').RNMail;
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {userUploadedPhoto, resetGetStarted} from '../../actions';
import {Input} from '../common';


var width = Dimensions.get('window').width
var isHidden = true
class ProfileNav extends Component {
    componentWillMount() {
        this.state = {
            bounceValueTwo: new Animated.Value(500),
            showCancelPolicy: false
        }
    }
    logoutUser() {
        firebase.auth().signOut().then(() => {
            Actions.onboardContainer({type: 'reset'});
        }, (error) => {
        // An error happened.
        });
    }
    handleHelp() {
        Mailer.mail({
        subject: this.props.fullName + ' ' + '-' + ' ' + 'Smoove Support',
        recipients: ['smoove.help@gmail.com'],
        body: '',
        isHTML: true, // iOS only, exclude if false
        }, (error, event) => {
            if(error) {
            AlertIOS.alert('Oops', 'Could not send mail. Please send an email to smoove.help@gmail.com');
            }
        });
    }
    handleFeedback() {
        Mailer.mail({
        subject: this.props.fullName + ' ' + '-' + ' ' + 'Smoove Feedback & Comments',
        recipients: ['contact.smoove@gmail.com'],
        body: '',
        isHTML: true, // iOS only, exclude if false
        }, (error, event) => {
            if(error) {
            AlertIOS.alert('Oops', 'Could not send mail. Please send an email to smoove.help@gmail.com');
            }
        });
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
                this.props.userUploadedPhoto(source.uri)
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
                                    RNS3.put(file, options).then(response => {
                                    if (response.status !== 201)
                                        throw new Error("Failed to upload image to S3");
                                        
                                        let database = firebase.database();
                                            database.ref('/' + this.props.userStorageLocation + '/' + this.props.userId).update({
                                                profileImage: response.body.postResponse.location
                                            });
                                    }).catch((err) => {
                                        AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                                        alert(err)
                                    })
                }).catch((err) => {
                       AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                });
        
            }
            });
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
		
	}
    toggleSubviewTwo() {    

		var toValue = 500;

		if(isHidden) {
		toValue = 0;
		}
		//This will animate the transalteY of the subview between 0 & 100 depending on its current state
		//100 comes from the style below, which is the height of the subview.
		Animated.spring(
		this.state.bounceValueTwo,
		{
			toValue: toValue,
			velocity: 7,
			tension: 2,
			friction: 4,
		}
		).start();
		isHidden = !isHidden;
	}
    handleCancellationModal() {
        if (isHidden === true && this.state.showCancelPolicy === false) {
            this.toggleSubviewTwo()
            this.setState({
                showCancelPolicy: true
            })
        }
    }
    hideCancellation() {
        if (isHidden === false) {
            this.toggleSubviewTwo() 
            setTimeout(() => {
                this.setState({
                    showCancelPolicy: false
                })
            }, 300)
        }
    }
	render() {
		console.log(this.props);
		return (
			<View style = {styles.containerStyle}>
                <View style = {{flex: 1}}>
                     <Modal
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.showCancelPolicy}
                        onRequestClose={() => {alert("Modal has been closed.")}}
                        >
                            <TouchableHighlight onPress = {() => this.hideCancellation()} activeOpacity = {1} underlayColor = "rgba(0,0,0,0.6)" style={{flex: 1, zIndex: 9999999, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                                <Animated.View style={[styles.secondSubView,
                                    {transform: [{translateY: this.state.bounceValueTwo}]}]}>
                                    <TouchableOpacity style = {{zIndex: 99999999, position: 'absolute', top: 0, width: '110%', height: 44, flex: -0, justifyContent:'center',alignContent: 'center', alignItems: 'center', backgroundColor: 'rgb(68,149,203)'}} onPress = {() => this.hideCancellation()}>
                                        <Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>Cancellation Policy</Text>
                                    </TouchableOpacity>
                                        <Text style = {{fontFamily: 'PTSans-Caption', fontSize: 20, padding: 20, backgroundColor: 'rgba(0,0,0,0)', textAlign: 'center',textAlignVertical: 'center'}}>
                                                In the event that a User cancels the Service less than forty-eight (48) hours before the day of the appointment, the User will be charged the full amount of the package. Any changes made by a User to an appointment must be made at least forty-eight (48) hours prior to the already agreed upon meeting time.
                                            </Text>
                                </Animated.View>
                            </TouchableHighlight>
                    </Modal>
                </View>
				<Image 
                    style = {styles.headStyle}
                    source = {require('../../assets/profile_header_background.png')}    
                >
                    <TouchableOpacity onPress = {() => Actions.pop()} style = {{position: 'absolute', top: 30, left: 10}}>
                        <Image source = {require('../../assets/nav_icon_close.png')} style = {{height: 19, resizeMode: 'contain'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.showImagePicker()} style = {{marginTop: -20, width: '50%', flex: 0, alignItems: 'center', justifyContent: 'center', flexDirection:'column'}}>
					    <Image source = {{uri: this.props.profileImage}} style = {styles.placeholderImage}/>
                         <Text style = {styles.helperTextStyle}>
                            Tap to Edit
                        </Text>
				    </TouchableOpacity>
                   
                    <Text style = {styles.nameStyle}>
                        {this.props.fullName}
                    </Text>
                    <Text style = {{
                        color:'#fff',
                        fontSize:14,
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: 'PTSans-CaptionBold'
                    }}>
                        {this.props.email}
                    </Text>
                </Image>
                
                <View style = {styles.bottomContainer}>
                    <View style = {{width: '130%'}}>
                        <Hr lineColor = "rgb(200,199,204)" />
                    </View>
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => Actions.notifications()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_notification@3x.png')} style = {{tintColor: 'black', resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Notifications</Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => Actions.addCard()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_creditcard.png')} style = {{resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Update Credit Card </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => Actions.changePassword()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_password.png')} style = {{resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Change Password </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => this.handleFeedback()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_feedback.png')} style = {{resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Feedback &#38; Comments </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => this.handleHelp()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                            <Image source = {require('../../assets/icon_help.png')} style = {{resizeMode: 'contain', height: 22, width: 30, marginLeft: 20, marginRight: 20}}/>
                            <Text style = {{color:'rgb(3,3,3)', fontSize: 17}}> Help </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => this.handleCancellationModal()}>
                        <View style = {{flex: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                           
                            <Text style = {{color:'#FF0000', fontSize: 17}}> Cancellation Policy </Text>
                        </View>
                        <Image source = {require('../../assets/icon_arrow.png')} style = {{marginRight: 20}}/>
                    </TouchableOpacity>
                    <Hr lineColor = "rgb(200,199,204)" />
                    <TouchableOpacity style = {styles.bottomListItem} onPress={() => this.logoutUser()}>      
                        <Text style = {styles.logout}> Log Out </Text>
                    </TouchableOpacity>
                    <View style = {{width: '130%'}}>
                        <Hr lineColor = "rgb(200,199,204)" />
                    </View>
				</View>
               
               
			</View>
			);
	}
}

const bottomContainerMargin = () => {
    if (width <= 321) {
		return 30
	} else {
		return 70
	}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'space-around',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)'
	},
	sliderStyle: {
		width: '80%'
	},
	bottomListItem: {
		flex: 0,
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
        height: 44,
        backgroundColor: '#fff'
	},
    placeholderImage: {
		height:108,
		width:108,
		borderRadius: 54,
        zIndex: 999
	},
    headStyle: {
        height: 275,
        width: '100%',
        flex: 0,
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        backgroundColor:'transparent'
    },
    helperTextStyle: {
		color:'#fff',
		fontSize:10,
		width: '100%',
		textAlign: 'center',
        fontFamily: 'PTSans-CaptionBold'
	},
    nameStyle: {
        color: '#fff',
        fontSize:34,
        fontFamily: 'PTSans-Caption'
    },
    bottomContainer: {
        flex: 0,
        height: '50%',
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: bottomContainerMargin(),
        alignItems: 'center'
    },
    logout: {
        color: 'rgb(20,119,112)',
        textAlign: 'center',
        fontSize: 17,
        width: '100%'
    },
    secondSubView: {
		flex: -1, alignItems: 'center', justifyContent: 'space-around', height: 500, width: '100%', backgroundColor: '#fff', position: 'absolute', bottom: 0, padding: 10
	},
};
const mapStateToProps = (state) => {
	return {
		userId: state.onboarding.userId,
        profileImage: state.getStarted.profileImage,
        fullName: state.getStarted.fullName,
        typeOfUser: state.getStarted.typeOfUser,
        userStorageLocation: state.getStarted.userStorageLocation,
        networkStatus: state.guide.networkStatus,
        email: state.getStarted.email
	};
};
export default connect(mapStateToProps, {userUploadedPhoto, resetGetStarted})(ProfileNav);
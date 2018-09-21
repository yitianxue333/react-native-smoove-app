import React, {Component} from 'react';
import {Text, TouchableOpacity, View, KeyboardAvoidingView, Image, AlertIOS, Modal, ActivityIndicator, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import dismissKeyboard from 'react-native-dismiss-keyboard'
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import Hr from 'react-native-hr';
import {Input} from '../common';
import LargeButton from '../LargeButton'
import {oldPasswordChanged, currentPasswordChanged, confirmPasswordChanged} from '../../actions';

var width = Dimensions.get('window').width

class ChangePassword extends Component {
    componentWillUpdate() {
        this.state = {
            animating: false
        }
    }
    
    onOldPasswordChanged(text) {
        this.props.oldPasswordChanged(text);
    }
    onNewPasswordChanged(text) {
        this.props.currentPasswordChanged(text);
    }
    onConfirmPasswordChanged(text) {
        this.props.confirmPasswordChanged(text);
    }
    submitPassChange() {
        this.setState({
            animating: true
        })
        dismissKeyboard()
        if (this.props.networkStatus != 'none') {
			 let trimmedEmail = this.props.newPassword;
            trimmedEmail = trimmedEmail.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
            if (this.props.newPassword === this.props.confirmPassword) {
                if (trimmedEmail !== '') {
                    if (trimmedEmail.length < 7) {
                        this.setState({
                            animating: false
                        })
                        AlertIOS.alert('Oops', 'Password must be at least seven characters')
                    } else {
                            firebase.auth().signInWithEmailAndPassword(this.props.email, this.props.oldPassword).then((response) => {
                                let user = firebase.auth().currentUser;
                                user.updatePassword(this.props.newPassword).then(() => {
                                    this.setState({
                                        animating: false
                                    })
                                    this.props.oldPasswordChanged('');
                                    this.props.currentPasswordChanged('');
                                    this.props.confirmPasswordChanged('');
                                }, (error) => {
                                    console.log(error)
                                     this.setState({
                                        animating: false
                                    })
                                    AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                                });
                            })
                            .catch((err) => {
                                    this.setState({
                                        animating: false
                                    })
                                AlertIOS.alert('Oops', 'Incorrect password, please try again.')
                            });
                    }
                } else {
                    this.setState({
                        animating: false
                    })
                    AlertIOS.alert('Oops', 'Bad connection. Please enter a valid password.')
                }
            }
            else {
                this.setState({
                        animating: false
                    })
                AlertIOS.alert('Oops', "Passwords do not match.")
            }
		} else {
            this.setState({
                        animating: false
                    })
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
       
    }
    hideKeyboardPop() {
        dismissKeyboard()
        Actions.pop()
    }
    getBottomCellHeight() {
        if (width <= 321) {
		    return 65
        } else {
            return 88.5
        }
    }
    getTopCellHeight() {
        if (width <= 321) {
		    return 34
        } else {
            return 44
        }
    }
	render() {
		
		return (
			<KeyboardAvoidingView behavior = "padding" style = {styles.containerStyle}>
                <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Change Password </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
                <View style = {styles.bottomContainer}>
                    <View style = {{width: '100%', height: this.getTopCellHeight(), flex: -1, alignContent: 'center', backgroundColor: '#fff', 
                                    borderBottomColor: 'rgb(190, 190, 190)',
	                            	borderBottomWidth: 0.5,}}>
                        <Input 
                            placeholderText = "Current Password"
                            onChangeText={this.onOldPasswordChanged.bind(this)}
                            value = {this.props.oldPassword}
                            secureTextEntry
                            focus = {true}
                            />
                    </View>
                    <View style = {{height: 44}} />
                    <View style = {{borderTopWidth: 0.5,
		                            borderTopColor: 'rgb(190, 190, 190)', 
                                    width: '100%', height: this.getBottomCellHeight(), 
                                    flex: -1, flexDirection: 'column', 
                                    alignContent: 'center', backgroundColor: '#fff'}}>
                        <Input 
                            placeholderText = "New Password"
                            onChangeText={this.onNewPasswordChanged.bind(this)}
                            value = {this.props.newPassword}
                            secureTextEntry
                            />
                        <View style = {{height: 0.5, width: '110%', marginLeft: -20}}>
                          <Hr lineColor = "rgb(190,190,190)" />
                        </View>
                        <Input 
                            placeholderText = "Confirm Password"
                            onChangeText={this.onConfirmPasswordChanged.bind(this)}
                            value = {this.props.confirmPassword}
                            secureTextEntry
                            />
                    </View>
				</View>
                <LargeButton onPress = {() => this.submitPassChange()}>
                    Save
                </LargeButton>
			</KeyboardAvoidingView>
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
    seperatorDiv: {
        height: 40,
        width: '100%',
        backgroundColor:'rgb(244,244,244)'
    },
    bottomContainer: {
        flex: 0,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 0.5,
		borderTopColor: 'rgb(190, 190, 190)',
		borderBottomColor: 'rgb(190, 190, 190)',
		borderBottomWidth: 0.5,
        marginTop:40
    }
};
const mapStateToProps = (state) => {
	return {
		userId: state.onboarding.userId,
        oldPassword: state.getStarted.oldPassword,
        newPassword: state.getStarted.newPassword,
        confirmPassword: state.getStarted.confirmPassword,
        email: state.onboarding.email,
        networkStatus: state.guide.networkStatus
	};
};
export default connect(mapStateToProps, {oldPasswordChanged, currentPasswordChanged, confirmPasswordChanged})(ChangePassword);
import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image, ScrollView, Keyboard, AlertIOS, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Hr from 'react-native-hr';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'react-native-dismiss-keyboard'
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {chatTextChanged} from '../../actions';
import moment from 'moment';
import {Input} from '../common';
import LargeButton from '../LargeButton'

var width = Dimensions.get('window').width

class ClientChat extends Component {
    componentWillMount() {
        this.state = {
            isWatching: false,
            messages: [],
            currentNotifications: []
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        firebase.database().ref('/messages/' + this.props.userId).on('value', (snapshot) => {
                console.log(snapshot.val());
                let userInfo = snapshot.val();
                if (!this.props.guidesName || this.props.superAdminChat) {
                    if (userInfo.adminMessages) {
                        this.setState({
                            messages: userInfo.adminMessages,
                            isWatching: userInfo.adminIsWatching
                        })
                    }
                } else if (this.props.guidesName) {
                    if (userInfo.guideMessages) {
                        this.setState({
                            messages: userInfo.guideMessages,
                            isWatching: userInfo.adminIsWatching
                        })
                    }
                }
        });
     
        firebase.database().ref('/messages/' + this.props.userId).update({clientIsWatching: true})
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        firebase.database().ref('/messages/' + this.props.userId).update({clientIsWatching: false})
        firebase.database().ref('/messages/' + this.props.userId).off('value');
    }
    chatTextChanged(text) {
        this.props.chatTextChanged(text);
    }
    _keyboardDidShow () {
       // console.log(this);
    }
    sendMessage() {
    if (this.props.networkStatus != 'none') {
			 var currentText = this.props.chatTextInput;
                let testForEmpty = currentText.replace(/\s/g,'');
                if (testForEmpty.length !== 0) {
                    let currentMessages = this.state.messages;
                    let message = {
                            type: 'client', 
                            text: this.props.chatTextInput,
                            timeSent: new Date()
                    }
                    let setStateAndSend = new Promise((resolve, reject) => {
                            this.setState({
                                messages: [...currentMessages, message]
                            })
                            resolve("Success!"); // Yay! Everything went well!
                            });
                      setStateAndSend.then((success) => {
                        let database = firebase.database();
                            if (!this.props.guidesName || this.props.superAdminChat) {
                                database.ref('/messages/' + this.props.userId).update({
                                    adminMessages: this.state.messages
                                });
                                 if (!this.state.isWatching) {
            
                                    database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903' ).once('value').then((snapshot) => { 
                                        if (snapshot.val()) {
                                            let currentNotifArray = snapshot.val().notifications;
                                            let newNotif = {
                                                time: new Date(),
                                                message: this.props.fullName + ' sent you a message',
                                                body: currentText,
                                                idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
                                                typeOfMessage: 'chat',
                                                notificationSeen: false,
                                                senderId: this.props.userId
                                            } 
                                            
                                            currentNotifArray.push(newNotif);
                                            database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903' ).update({
                                                notifications: currentNotifArray
                                            })
                                            database.ref('/notifications/notificationArray').update({
                                                notifications: [newNotif]
                                            })
                                        } else {
                                            let newNotif = {
                                                time: new Date(),
                                                message: this.props.fullName + ' sent you a message',
                                                body: currentText,
                                                idToSend: 'yvNMR2zm5LXonAKTRvX4dAKtg903',
                                                typeOfMessage: 'chat',
                                                notificationSeen: false,
                                                senderId: this.props.userId
                                            } 
                                            let currentNotifArray = [newNotif]
                                             database.ref('/notifications/yvNMR2zm5LXonAKTRvX4dAKtg903' ).update({
                                                notifications: currentNotifArray
                                              })
                                             database.ref('/notifications/notificationArray').update({
                                                notifications: [newNotif]
                                            })
                                        }
                                    });
                                   
                                }
                            } else if (this.props.guidesName) {
                                database.ref('/messages/' + this.props.userId).update({
                                    guideMessages: this.state.messages
                                });
                                 if (!this.state.isWatching) {
                                    database.ref('/notifications/' + this.props.guidesId ).once('value').then((snapshot) => { 
                                        if (snapshot.val()) {
                                            let currentNotifArray = snapshot.val().notifications;
                                            let newNotif = {
                                                time: new Date(),
                                                message: this.props.fullName + ' sent you a message',
                                                body: currentText,
                                                idToSend: this.props.guidesId,
                                                typeOfMessage: 'chat',
                                                notificationSeen: false,
                                                senderId: this.props.userId
                                            } 
                                            currentNotifArray.push(newNotif);
                                            database.ref('/notifications/' + this.props.guidesId ).update({
                                                notifications: currentNotifArray
                                            })
                                            database.ref('/notifications/notificationArray').update({
                                                notifications: [newNotif]
                                            })
                                        } else {
                                            let newNotif = {
                                                time: new Date(),
                                                message: this.props.fullName + ' sent you a message',
                                                body: currentText,
                                                idToSend: this.props.guidesId,
                                                typeOfMessage: 'chat',
                                                notificationSeen: false,
                                                senderId: this.props.userId
                                            } 
                                            let currentNotifArray = [newNotif]
                                             database.ref('/notifications/' + this.props.guidesId ).update({
                                                notifications: currentNotifArray
                                              })
                                             database.ref('/notifications/notificationArray').update({
                                                notifications: [newNotif]
                                            })
                                        }
                                    });

                                }
                            }
                     });
                }
                this.props.chatTextChanged('');
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
       
    }
    
    checkForWhoseChatting() {
        if (!this.props.guidesName || this.props.superAdminChat) {
            var adminProfileImage;
            firebase.database().ref('/admin/yvNMR2zm5LXonAKTRvX4dAKtg903' ).once('value').then(snapshot => {
                                                console.log(snapshot.val().profileImage)
                                                adminProfileImage = snapshot.val().profileImage
                                              });
            return <View style = {{flex: 0, width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>   
                        <Image source = {{uri: 'https://firebasestorage.googleapis.com/v0/b/smoove-32fdb.appspot.com/o/signup_placeholderimage.png?alt=media&token=b401414f-fa7a-42ac-9524-24ec2e8c6a43'}} 
                                style = {{height: 49, width: 49, borderRadius: 24.5, position: 'absolute', left: 10}}
                            />
                        <Text style = {{fontSize: 20, marginLeft: 10, color: '#fff', fontFamily: 'PTSans-CaptionBold'}}>Smoove</Text>
                    </View>
        } else if (this.props.guidesName) {
            return <View style = {{flex: 0, width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>   
                        <Image source = {{uri: this.props.guidesImage}} 
                                style = {{height: 49, width: 49, borderRadius: 24.5, position: 'absolute', left: 10}}
                            />
                        <Text style = {{fontSize: 20, marginLeft: 10, color: '#fff', fontFamily: 'PTSans-CaptionBold'}}>{this.props.guidesName}</Text>
                    </View>
        }
    }
    getMessagesAndList() {
        var counter = 0;
        let messageArray = this.state.messages;
        return messageArray.map((message) => {
            counter++;
            if (message.type === 'admin') {
                return <View style = {styles.chatBubbleContainer} key = {counter}><View style = {styles.adminMessage}>
                            <Text style = {styles.adminText}>{message.text}</Text>
                       </View>
                       <Image style = {{alignSelf: 'flex-start', marginTop: -18, marginLeft: 3}}source = {require('../../assets/chat_bubble_gray.png')} />
                       </View>
            } else if (message.type === 'client') {
                return <View style = {styles.clientChatBubbleContainer} key = {counter} ><View style = {styles.clientMessage}>
                            <Text style = {styles.adminText}>{message.text}</Text>
                       </View>
                       <Image style = {{alignSelf: 'flex-end', marginTop: -18, marginRight: 3}} source = {require('../../assets/chat_bubble_blue.png')} />
                       </View>
            }
        });
    }
    hideKeyboardPop() {
        dismissKeyboard()
        Actions.pop()
    }
	render() {
		return (
			<View style = {styles.containerStyle}>
                <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Chat </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
				<Image style = {styles.headStyle} source = {require('../../assets/header_chat_background.png')}>
                        <Text style = {styles.headTextClientStyle}>You are now chatting with:</Text>
                        {this.checkForWhoseChatting()}
                </Image>
                <ScrollView 
                    style = {styles.messageContainer} 
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                             this.scrollView.scrollToEnd({animated: true});
                 }}>
                    {this.getMessagesAndList()}
                </ScrollView>
                <View style = {styles.bottomInputContainer}>
                    <View style = {styles.inputContainer}>
                        <Input 
                            placeholderText = "Enter your message..." 
                            onChangeText = {this.chatTextChanged.bind(this)}
                            value = {this.props.chatTextInput}
                            inputRadius = {5}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.sendMessage()} style={styles.buttonStyle}>
                        <Text style={styles.sendStyle}> 
                            Send
                        </Text>
                    </TouchableOpacity>
                </View>
                <KeyboardSpacer />
			</View>
			);
	}
}

getInputWidth = () => {
    if (width <= 321) {
			return 250
		} else {
			return 308
		}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'space-around',
		width:null,
		height:null,
		backgroundColor:'rgb(244,244,244)',
        flexDirection: 'column',
        paddingTop: 65
	},
    messageContainer: {
        width: '100%',
        height: '100%',
        flex: 0
    },
	viewStyle: {
		width:'49.9999%',
		height: '100%'
	},
    sendStyle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'PTSans-CaptionBold'
    },
	buttonStyle: {
		flex: 0,
		backgroundColor: 'rgba(68,149,203,100)',
        borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
        height: 30,
        width: 49
	},
	textStyle: {
		color: '#fff',
		padding: 5
	},
    headStyle: {
        width: '100%',
        height: 80,
        alignSelf: 'flex-start',
        flex: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor:'transparent',
        flexDirection: 'column', 
        padding: 10,
        
        zIndex: 9999
    },
    headTextStyle: {
        color:'#fff'
    },
    headTextClientStyle: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'PTSans-Caption'
    },
    bottomInputContainer: {
        width: '100%',
        backgroundColor: 'rgba(61,61,61,100)',
        height: 47,
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    inputContainer: {
        width: getInputWidth(),
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    adminMessage: {
        padding: 20,
        backgroundColor: 'rgba(61,61,61,100)',
        flex: -1,
        alignItems: 'center',
        borderRadius: 30,
        alignSelf: 'flex-start'
    },
    chatBubbleContainer: {
        width: '80%',
        flex: -1,
        padding: 20
    },
    clientChatBubbleContainer: {
        width: '80%',
        flex: -1,
        padding: 20,
        alignSelf: 'flex-end'
    },
    clientMessage: {
        padding:20,
        backgroundColor: 'rgba(68,149,203,100)',
        flex: -1,
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 30
    },
    adminText: {
        color: '#fff',
        fontFamily: 'PTSans-Caption',
        fontSize: 15
    }
};
const mapStateToProps = (state) => {
	return {
		userId: state.onboarding.userId,
        chatTextInput: state.guide.chatTextInput,
        guidesName: state.getStarted.guidesName,
        guidesImage: state.getStarted.guidesImage,
        fullName: state.getStarted.fullName,
        guidesId:state.getStarted.guidesId,
        networkStatus: state.guide.networkStatus
	};
};
export default connect(mapStateToProps, 
	{chatTextChanged})(ClientChat);
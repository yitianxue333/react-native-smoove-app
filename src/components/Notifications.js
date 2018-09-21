import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView, StatusBar, Dimensions, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import LargeButton from './LargeButton'

var counter = 0
var width = Dimensions.get('window').width

class Notifications extends Component {
    componentWillMount() {
        this.state = {
            counter: 0,
            selectedPlaces: [],
            fullSelected: [],
            notificationArray: [],
            isRefreshing: false
        }
       
        let database = firebase.database()
        database.ref('/notifications/' + this.props.userId).once('value').then((snapshot) => {
            console.log(snapshot.val())
            if (snapshot.val()) {
                this.setState({
                    notificationArray: snapshot.val().notifications
                })
            }
        });
    }

    getUpdatedList() {
       
        this.setState({
            isRefreshing: true
        })
         let database = firebase.database()
        database.ref('/notifications/' + this.props.userId).once('value').then((snapshot) => {
            console.log(snapshot.val())
            if (snapshot.val()) {
                this.setState({
                    notificationArray: snapshot.val().notifications
                })
            }
        }).then(() => {
            this.setState({
                isRefreshing: false
            })
        })
      
    }

    getTimeDiff(then) {
        let now  = moment();
        then = moment(then);

        let ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
        let dur = moment.duration(ms);
        let total = Math.floor(dur.asHours()) + moment.utc(ms).format(":mm:ss");
        let humanizedTime = (moment.duration(total).humanize())
        return humanizedTime + ' ' + 'ago'
    }
    checkForSeen(seen) {
        if (!seen) {
            return <Image source = {require('../assets/icon_dot@3x.png')} style = {{position: 'absolute', left: 15, top: 29, height: 10, width: 10}}/>
        }
    }
    routeToNotif(typeOfMessage, time, message) {
       
        let notificationArray = this.state.notificationArray
        
        var index = notificationArray.map(function(e) { return e.time; }).indexOf(time);
        console.log(index)
        if(index !== -1) {
            notificationArray[index].notificationSeen = true
            
            firebase.database().ref('/notifications/' + this.props.userId).update({
                notifications: notificationArray
            }).then(() => {
                this.setState({
                    notificationArray: notificationArray
                })
                if (typeOfMessage === 'chat') {
                    setTimeout(() => {
                        let i = 0
                        let name = ''
                        while(i != 5) {
                            name += message[i]
                            console.log(message[i])
                            i++
                        }
                        if (name === 'Super') {
                            Actions.clientChat({superAdminChat: true})
                        } else {
                            Actions.clientChat()
                        }
                        console.log(name)
                    }, 500)
                } else {
                    Actions.popTo('mainAfterPurchase')
                }
            })
        }
    }
    getBodySize() {
        if (width <= 321) {
			return 10
		} else {
			return 12
		}
    }
    mapNotifList() {
        let notificationArray = this.state.notificationArray
        notificationArray.sort(function(a, b) {
                a = new Date(a.time);
                b = new Date(b.time);
                return a>b ? -1 : a<b ? 1 : 0;
            });
        if (notificationArray) {
            
            return notificationArray.map((notification) => {
                       counter++
                            return      <View key = {counter} style = {{width: '100%', height: 64}}>
                                                <TouchableOpacity onPress = {() => this.routeToNotif(notification.typeOfMessage, notification.time, notification.message)} style = {styles.listItem}>
                                                    {this.checkForSeen(notification.notificationSeen)}
                                                    <View style = {{flex: -1, flexDirection: 'column', alignContent: 'center', height: '100%', width: '100%'}}>
                                                
                                                            <Text style = {{fontFamily: 'PTSans-Caption', marginLeft: 30, fontSize: this.getBodySize(), color: 'rgb(61,61,61)'}}>
                                                                    {notification.body}
                                                            </Text>
                                                       
                                                        <Text style = {{fontFamily: 'PTSans-Caption', color: 'rgb(199 ,196 ,196)', fontSize: this.getBodySize(), marginLeft: 30}}>
                                                                {this.getTimeDiff(notification.time)}
                                                        </Text>
                                                        
                                                    </View>
                                                 
                                                </TouchableOpacity>
                                                <Hr lineColor = "rgb(190,190,190)" />
                                            </View>
            });
        } else {
            return <Text style = {{textAlign: 'center', marginTop: 50, fontSize: 25, fontFamily: 'PTSans-CaptionBold', padding: 10}}> No notifications to display </Text>
        }
    }
    checkForImage() {
        let notificationArray = this.state.notificationArray
        if (!notificationArray || notificationArray.length === 0) {
            return <View style = {{height: '100%', width: '100%', flex: 0, backgroundColor: '#f4f4f4', padding: 65, alignItems: 'center', justifyContent: 'center'}}><Image source = {require('../assets/emptystate_notifications@3x.png')} style = {{height: '100%', width: '100%', resizeMode: 'contain', zIndex: 9999}} /></View>
        }
    }
	render() {
		return (
			<View style = {styles.containerStyle}>
                <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Notifications </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
                {this.checkForImage()}
				<ScrollView style = {styles.scrollView}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.getUpdatedList()}
                        tintColor='rgba(68,149,203,100)'
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffff00"
                    />
                    }
                >
                    {this.mapNotifList()}
                </ScrollView>
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
    scrollView: {
        backgroundColor: '#fff',
        width: '100%'
    },
	textfieldContainerStyle: {
		backgroundColor: '#fff',
		width: '100%',
		height: '25%',
		borderTopWidth: 1.5,
		borderTopColor: '#bebebe',
		borderBottomColor: '#bebebe',
		borderBottomWidth: 1.5
	},
	helperTextStyle: {
		color:'rgba(61, 61, 61, 100)',
		fontSize:10,
		width: '70%',
		textAlign: 'center'
	},
    listItem: {
        padding: 20,
        flex: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginRight: 10
    },
	imageStyle: {
		height:70,
		width:70,
		borderRadius: 35
	}
};
const mapStateToProps = (state) => {
	return {
		
        userId: state.onboarding.userId,
      
	};
};
export default connect(mapStateToProps
	)(Notifications);
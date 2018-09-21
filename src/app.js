import React, {Component} from 'react';
import ReduxThunk from 'redux-thunk';
import {NetInfo} from 'react-native';
import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import firebase from 'firebase';
import {setNetworkStatus} from './actions'
import reducers from './reducers';
import Router from './router';

const animationStyle = (props) => {
    const { layout, position, scene } = props;

    const direction = (scene.navigationState && scene.navigationState.direction) ?
        scene.navigationState.direction : 'horizontal';

    const index = scene.index;
    const inputRange = [index - 1, index, index + 1];
    const width = layout.initWidth;
    const height = layout.initHeight;

    const opacity = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.3],
        outputRange: [1, 1, 0],
    });

    const scale = position.interpolate({
        inputRange,
        //default: outputRange: [1, 1, 0.95],
        outputRange: [1, 1, 1],
    });

    let translateX = 0;
    let translateY = 0;

    switch (direction) {
        case 'horizontal':
            translateX = position.interpolate({
                inputRange,
                //default: outputRange: [width, 0, -10],
                outputRange: [width, 0, 0],
            });
            break;
        case 'vertical':
            translateY = position.interpolate({
                inputRange,
                //default: outputRange: [height, 0, -10],
                outputRange: [height, 0, 0],
            });
            break;
    }

    return {
        opacity,
        transform: [
            { scale },
            { translateX },
            { translateY },
        ],
    };
};

class App extends Component {
	componentWillMount() {
		  const config = {
		    apiKey: "AIzaSyDA5dnGYsBfcv9ymvSON8sd8r35OPmdD7Q",
			authDomain: "smoove-94fc6.firebaseapp.com",
			databaseURL: "https://smoove-94fc6.firebaseio.com",
			projectId: "smoove-94fc6",
			storageBucket: "smoove-94fc6.appspot.com",
			messagingSenderId: "249845789809"
		  };
		  firebase.initializeApp(config);
		  FCM.on(FCMEvent.Notification, async (notif) => {
				   console.log(notif)
				  
				   		if(notif.opened_from_tray){
							//app is open/resumed because user clicked banner
							Actions.notifications()
						}
						switch (notif._notificationType) {
							case NotificationType.Remote:
								notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
								break;
							case NotificationType.NotificationResponse:
								notif.finish();
								break;
							case NotificationType.WillPresent:
								notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
								break;
						}
						
				});
			
		}
	render() {
		return (
			<Provider store = {createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
				<Router getSceneStyle={{backgroundColor: '#3d3d3d'}}/>
			</Provider>
			);
	}
}

export default App;
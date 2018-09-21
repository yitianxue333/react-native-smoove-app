import ImageSlider from 'react-native-image-slider';
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, StatusBar, Dimensions, AlertIOS} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {Input, Button} from '../common';
import LargeButton from '../LargeButton';

var RNFS = require('react-native-fs')

class Tutorial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            position: 0,

        };
    }

    checkForSlideFour() {
        if (this.state.position === 4) {
            return <View style={{
                position: 'absolute',
                bottom: 10,
                width: '100%',
                padding: 30,
                borderRadius: 15,
                left: 0,
                right: 0
            }}>
                <TouchableOpacity style={{flex: 1, width: '100%', height: 50}} onPress={() => this.completeTutorial()}>

                </TouchableOpacity>
            </View>
        } else {
            return
        }
    }

    completeTutorial() {
        // if (this.props.networkStatus != 'none') {
        //     database = firebase.database()
        //     database.ref('/user/' + this.props.userId).update({
        //         tutorialComplete: true
        //     }).then(() => {
        //         Actions.prepurchase()
        //     })
        // } else {
        //     setTimeout(() => {
        //         AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
        //     }, 1000)
        // }
        // Actions.onboardContainer({from: 'MAIN_VIEW'})
        var path = RNFS.DocumentDirectoryPath + '/tutorial.txt'
        RNFS.writeFile(path, '', 'utf8')
            .then(() => {
                Actions.onboardContainer()
            })
            .catch((err) => {
                console.log('err', err)
                setTimeout(() => {
                    AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
                }, 1000)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageSlider
                    images={[
                        require('../../assets/Tutorial_one@3x.png'),
                        require('../../assets/Tutorial_five@3x.png'),
                        require('../../assets/Tutorial_Two@3x.png'),
                        require('../../assets/Tutorial_three@3x.png'),
                        require('../../assets/Tutorial_Four@3x.png')
                    ]}
                    position={this.state.position}
                    onPositionChanged={position => this.setState({position})}
                    height={Dimensions.get('window').height}


                />
                {this.checkForSlideFour()}

                <TouchableOpacity style={{position: 'absolute', top: 20, right: 5}}
                                  onPress={() => this.completeTutorial()}>
                    <Text style={{
                        fontFamily: 'PTSans-Caption',
                        color: 'rgb(68,149,203)',
                        fontSize: 18,
                        backgroundColor: 'rgba(0,0,0,0)'
                    }}>Skip</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    backgroundImageStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: null,
        height: null,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    loginStyle: {
        color: 'rgba(68,149,203,100)',
        fontFamily: 'PTSans-CaptionBold',
        letterSpacing: 2
    },
    helperText: {
        color: '#fff',
        fontFamily: 'PTSans-Caption',
        letterSpacing: 2
    }
};

const mapStateToProps = (state) => {
    return {
        email: state.onboarding.email,
        password: state.onboarding.password,
        errorText: state.onboarding.errorText,
        userId: state.onboarding.userId,
        networkStatus: state.guide.networkStatus
    };
};

export default connect(mapStateToProps)(Tutorial);
import React, { Component } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Modal, ActivityIndicator, Image, Text, AlertIOS, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import axios from 'axios'
import firebase from 'firebase'
import {saveUserStripeToken} from '../../actions';
import stripe, {PaymentCardTextField} from 'tipsi-stripe'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import LargeButton from '../LargeButton'

const styles = StyleSheet.create({
  field: {
    width: 300,
    color: '#449aeb',
    borderWidth: 0
  },
  container: {
      flex: 1,
      height: null,
      width: null,
      backgroundColor:'rgb(244,244,244)',
      justifyContent: 'space-between',
      paddingTop: 65
  },
  fieldContainer: {
      width: '100%',
      height: 'auto',
      padding: 5,
      flex: 0,
      backgroundColor: '#ffffff',
      marginTop: 50,
      marginBottom: 50,
      borderWidth: 1,
      borderColor: '#d3d3d3'
  }
})

class AddCard extends Component {
  componentWillMount() {
      stripe.init({
        publishableKey: 'pk_live_q2kRryFIxgd9WUyTOhVwJshU'
      })
      this.state = {
          number: '',
          valid: false,
          month: '',
          year: '',
          cvc: '',
          animating: false,
          addedModal: false
      }
  }
  componentWillUnmount() {
      this.setState({
          animating: false
      })
  }
  handleFieldParamsChange = (valid, params) => {
    this.setState({
        valid: valid,
        number: params.number,
        month: params.expMonth,
        year: params.expYear,
        cvc: params.cvc
    })
  }

  hideKeyboardPop() {
      dismissKeyboard()
      Actions.pop()
  }

  submitNewCard() {
      
      if (this.props.networkStatus != 'none') {
			dismissKeyboard()
            this.setState({
                animating: true
            })
            if (this.state.valid) {
                let params = {
                    number: this.state.number,
                    expMonth: this.state.month,
                    expYear: this.state.year,
                    cvc: this.state.cvc
                }
                stripe.createTokenWithCard(params).then((response) => {
                        //console.log(response);
                        if (!this.props.stripeToken) {
                            console.log(response.tokenId)
                            axios.post('https://smoove-api.herokuapp.com/api/createStripeCustomer', {token: response.tokenId}).then((response) => {
                                console.log(response.data.data.stripeCustomerId);
                                let database = firebase.database();
                                this.props.saveUserStripeToken(response.data.data.stripeCustomerId);
                                database.ref('/user/' + this.props.userId).update({
                                    stripeToken: response.data.data.stripeCustomerId
                                }).then(() => {
                                    this.setState({
                                        animating: false,
                                        addedModal: true
                                    })
                                }).catch(err => {
                                    this.setState({
                                        animating: false
                                    })
                                    setTimeout(() => {
                                        console.log(err.message)
                                         AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                                    }, 300)
                                })
                            }).catch(err => {
                                this.setState({
                                        animating: false
                                    })
                                    setTimeout(() => {
                                        console.log(err.message)
                                        AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                                    }, 300)
                                })
                        } else if (this.props.stripeToken) {
                            axios.post('https://smoove-api.herokuapp.com/api/updateCard', {token: response.tokenId, customerId: this.props.stripeToken}).then((response) => {
                                console.log(response.data);
                            }).then(() => {
                                    this.setState({
                                        animating: false,
                                        addedModal: true
                                    })
                                    console.log('popping')
                                    
                                }).catch(err => {
                                    this.setState({
                                        animating: false
                                    })
                                    setTimeout(() => {
                                       AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                                    },1000);
                                })
                        } else {
                            this.setState({
                                animating: false
                            })
                            setTimeout(() => {
                                AlertIOS.alert('Oops', 'Something went wrong, please try again.')
                            },1000);
                        }
                    
                    })
                    .catch((err) => {
                        this.setState({
                            animating: false
                        })
                        setTimeout(() => {
                           AlertIOS.alert('Oops', 'Please check card info.')
                        }, 1000)
                        console.log(err);
                    });
            } else {
                this.setState({
                    animating: false
                })
                setTimeout(() => {
                    AlertIOS.alert('Oops', 'Please enter a valid card.')
                },1000);
            }
		} else {
			setTimeout(() => {
				AlertIOS.alert('Oops', 'Bad connection. Please find somewhere with better service or connect to wifi to use Smoove.')
			}, 1000)
		}
      
  }

  removeModalAndPop() {
      this.setState({
          addedModal: false
      })
      setTimeout(() => {
        Actions.pop({refresh: {title: 'new title'}})
      }, 500)
  }

  render() {
    return (
        <KeyboardAvoidingView style = {styles.container} behavior = "padding">
                <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
                     <TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => this.hideKeyboardPop()}>
						<Image style = {{height: 20, marginTop: 4, width: 30, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18, textAlign: 'center'}}> Add Credit Card </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('clicked empty')}>
						<View style = {{ height: 25, width: 25}} />
					</TouchableOpacity>
                </View>
            <Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.addedModal}
					onRequestClose={() => {alert("Modal has been closed.")}}
					>
						<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
							<Image source = {require('../../assets/purchased@3x.png')} style={{flex: 0, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0)', padding: 10}}>
								<Image source = {require('../../assets/nav_bar_logo.png')} style = {{position: 'absolute', top: 11, height: 36, width: 36, resizeMode: 'contain'}}/>
								<Image source = {require('../../assets/nav_logo.png')} style = {{height: 15, width: 105, position: 'absolute', top: 55}} />
								<Text style = {{position: 'absolute', top: 85, color: 'rgb(51,51,51)', fontSize: 20, fontFamily: 'PTSans-CaptionBold'}}>Card Added</Text>
								<Text style = {{position: 'absolute', height: 72, width: '100%', textAlign: 'center', top: 115, color: 'rgb(51,51,51)', fontSize: 14, fontFamily: 'PTSans-Caption'}}>
																		You can now purchase a package.
								</Text>
								<TouchableOpacity style = {{height: 40, width: 226, flex: -1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 195}} onPress = {() => this.removeModalAndPop()}>
									<Text style = {{fontSize: 25, color: 'rgb(255,255,255)', fontFamily: 'PTSans-Caption'}}>OK</Text>
								</TouchableOpacity>
							</Image>
						</View>
					</Modal>
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
            <View style = {styles.fieldContainer}>
                <PaymentCardTextField
                    style={styles.field}
                    cursorColor={'blue'}
                    textErrorColor={'red'}
                    placeholderColor={'gray'}
                    numberPlaceholder={'blue'}
                    expirationPlaceholder={'blue'}
                    cvcPlaceholder={'891'}
                    disabled={false}
                    onParamsChange={this.handleFieldParamsChange}
                />
            </View>
                <LargeButton onPress = {() => this.submitNewCard()}>
                    Add Card
                </LargeButton>
        </KeyboardAvoidingView>
    )
  }
}
const mapStateToProps = (state) => {
	return {
		userId: state.onboarding.userId,
        stripeToken: state.getStarted.stripeToken,
        networkStatus: state.guide.networkStatus,
        version: state.getStarted.version
	};
};
export default connect(mapStateToProps, {saveUserStripeToken})(AddCard);   


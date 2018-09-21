import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Autolink from 'react-native-autolink';
import Hr from 'react-native-hr';
import {Actions} from 'react-native-router-flux';

var width = Dimensions.get('window').width

class SuggestView extends Component {
    constructor(props) {
        super(props)
    }
    getPriceSize() {
        if (width <= 321) {
			return 15
		} else {
			return 25
		}
    }
    getLocationSize() {
        if (width <= 321) {
			return 12
		} else {
			return 15
		}
    }
    getDescriptionSize() {
        if (width <= 321) {
			return 12
		} else {
			return 18
		}
    }
	render() {
        console.log(this.props)
		return (
			<View style = {styles.containerStyle}>
                 <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Hotel Suggestion </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
                <Image source = {{uri: this.props.image}} style = {{height: 285, width: '100%', zIndex: 999}} />
                <View style = {{
                    borderColor: 'rgb(68, 149, 203)',
                    borderWidth: 1,
                    height: 57,
                    width: '100%',
                    flex: 0,
                    flexDirection: 'row'
                }}>
                    <View style = {{
                        height: '100%',
                        flex: 1,
                        borderRightColor: 'rgb(68, 149, 203)',
                        borderRightWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        padding: 5
                    }}>
                        <Text style = {{
                            color: 'rgb(61,61,61)',
                            fontFamily: 'PTSans-Caption',
                            fontSize: this.getLocationSize(),
                            backgroundColor: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center'
                        }}>
                            {this.props.location}
                        </Text>
                    </View>
                    <View style = {{
                        height: '100%',
                        flex: 1,
                        borderLeftColor: 'rgb(68, 149, 203)',
                        borderLeftWidth: 0.5,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}>
                        <View style = {{flex: 1, width: '100%', height: '100%', backgroundColor: '#fff', alignContent: 'center', alignItems: 'center', justifyContent:'center', zIndex: 99999}}>
                        <Text style = {{
                            fontSize: this.getPriceSize(),
                            color: 'rgb(68,149,203)',
                            fontFamily: 'PTSans-CaptionBold',
                            backgroundColor: '#fff',
                            textAlign: 'center',
                            textAlignVertical: 'center'
                        }}>
                            {this.props.price}
                        </Text>
                        </View>
                    </View>
                </View>
                <View style = {{
                    flex: 1,
                    padding: 10,
                    alignContent: 'flex-start',
                    flexDirection: 'column',
                    width: '100%'
                }}>
                    <Text style = {{
                        color: 'rgb(61,61,61)',
                        fontSize: this.getDescriptionSize(),
                        fontFamily: 'PTSans-CaptionBold',
                        textDecorationLine: 'underline'
                    }}>
                        Description:
                    </Text>
                    <Autolink text = {this.props.description} style = {{
                        color: 'rgb(61,61,61)',
                        fontSize: this.getDescriptionSize(),
                        fontFamily: 'PTSans-Caption'
                    }}> 
                        
                    </Autolink>
                </View>
			</View>
			);
	}
}

const styles = {
	containerStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'flex-start',
		width:null,
		height:null,
		backgroundColor: '#fff',
        paddingTop: 65
	},
	placeholderImage: {
		marginTop:30,
		borderRadius: 20,
		height:100,
		width:100
	},
	textfieldContainerStyle: {
		backgroundColor: '#fff',
		width: '100%',
		height: 109,
		borderTopWidth: 0.5,
		borderTopColor: "rgb(190,190,190)",
		borderBottomColor: "rgb(190,190,190)",
		borderBottomWidth: 0.5,
		position: 'absolute',
		top:200
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

export default SuggestView;
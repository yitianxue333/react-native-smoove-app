import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView, StatusBar, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Hr from 'react-native-hr';
import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {saveSuggestionList} from '../../actions';
import LargeButton from '../LargeButton'



class SuggestList extends Component {
    componentWillMount() {
     
        let database = firebase.database()
  
        database.ref('/userSuggestions/' + this.props.userId).once('value').then((snapshot) => {
            console.log(snapshot.val())
            if (snapshot.val()) {
                 this.props.saveSuggestionList(snapshot.val())
            } else {
                this.props.saveSuggestionList([])
            }
        });
    }
    checkForImage(){
        let suggestArray = this.props.suggestionList
        if (!suggestArray || suggestArray.length === 0) {
            return <View style = {{height: '100%', width: '100%', flex: 0, backgroundColor: '#f4f4f4', padding: 65, alignItems: 'center', justifyContent: 'center'}}><Image source = {require('../../assets/emptystate_suggestions@3x.png')} style = {{height: '100%', width: '100%', resizeMode: 'contain', zIndex: 9999}} /></View>
        }
    }
    mapSuggestList() {
       
            let suggestListArray = this.props.suggestionList
            console.log(suggestListArray);
            if (suggestListArray) {
                suggestListArray.reverse();
                if (suggestListArray.length > 0) {
                    let counter = 0;
                    console.log(suggestListArray);
                    return suggestListArray.map((suggest) => {
                            counter++
                                    return <View key = {counter} style = {{width: '100%'}}><TouchableOpacity key = {counter} style = {styles.containerItem} onPress = {() => Actions.suggestView({location: suggest.location, description: suggest.description, image: suggest.image, price: suggest.price})}>
                                                        <Image source = {{uri: suggest.image}} style = {styles.imageStyle}/>
                                                        <View style = {styles.listItem}>
                                                            <View style = {{flex: 0, flexDirection: 'column', alignContent: 'center', marginLeft: 20}}>
                                                                <Text style = {{fontSize: 14, fontFamily: 'PTSans-CaptionBold', color: 'rgb(61, 61, 61)'}}>
                                                                        Hotel Suggestion
                                                                </Text>
                                                                <Text style = {{fontFamily: 'PTSans-Caption', color: 'rgb(90, 93, 96)', fontSize: 10}}>
                                                                        {suggest.location}
                                                                </Text>
                                                            </View>
                                                            
                                                        </View>
                                                        <Image source = {require('../../assets/icon_arrow.png')} style = {{position: 'absolute', right: 20, top: 40, bottom: 0, zIndex: 99999, marginRight: 20, height: 25, resizeMode: 'contain'}}/>
                                            </TouchableOpacity><View style = {{height: 0.5, width: '100%'}}>
                                                           <Hr lineColor = "rgba(197,195,195,0.7)" />
                                                        </View></View>
                    });
                } 
            } 
      
    }
  
	render() {
		return (
			<View style = {styles.containerStyle}>
                 <View style = {{width: '100%', height: 65, flex: 0, flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 18, justifyContent: 'space-between', backgroundColor: 'rgba(61, 61, 61, 100)', position: 'absolute', top: 0}}>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-start', alignContent: 'flex-start'}} onPress = {() => Actions.pop()}>
						<Image style = {{height: 20, width: 20, resizeMode: 'contain'}}source = {require('../../assets/nav_icon_back@3x.png')} />
					</TouchableOpacity>
					<Text style = {{fontFamily: 'PTSans-CaptionBold', color: '#fff', fontSize: 18}}> Hotel Suggestions </Text>
					<TouchableOpacity style = {{width: 70, flex: 0, justifyContent: 'flex-end', flexDirection: 'row', alignContent: 'flex-end'}} onPress = {() => console.log('click')}>
						<View style = {{ height: 25, width: 25}}  />
					</TouchableOpacity>
				</View>
                {this.checkForImage()}
				<ScrollView style = {styles.scrollView}>
                    {this.mapSuggestList()}
                </ScrollView>
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 58
    },
    containerItem: {
        padding: 20,
        flex: 0,
        flexDirection: 'row',
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
        suggestionList: state.guide.suggestionList
	};
};
export default connect(mapStateToProps, {saveSuggestionList})(SuggestList);
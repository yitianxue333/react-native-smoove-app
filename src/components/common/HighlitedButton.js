import React from 'react'
import {TouchableHighlight, View} from 'react-native'
import {apartmentSelectionChanged} from '../../actions'
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'
import {connect} from 'react-redux'

class HighlitedButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            backgroundColorOne: 'rgba(255,255,255, 0)',
            backgroundColorTwo: 'rgba(255,255,255, 0)',
            backgroundColorThree: 'rgba(255,255,255, 0)'
        }
    }

    handlePriceSelection(selectedOption) {
        this.props.apartmentSelectionChanged(selectedOption)
        if (this.props.premium === true) {
            if (selectedOption == 'Studio') {
                this.setState({
                    backgroundColorOne: 'rgba(255,255,255, 0.5)',
                    backgroundColorTwo: 'rgba(255,255,255, 0)',
                    backgroundColorThree: 'rgba(255,255,255, 0)'
                })
            } else if (selectedOption == '1 Bedroom') {
                this.setState({
                    backgroundColorOne: 'rgba(255,255,255, 0)',
                    backgroundColorTwo: 'rgba(255,255,255, 0.5)',
                    backgroundColorThree: 'rgba(255,255,255, 0)'
                })
            } else if (selectedOption == '2 Bedroom') {
                this.setState({
                    backgroundColorOne: 'rgba(255,255,255, 0)',
                    backgroundColorTwo: 'rgba(255,255,255, 0)',
                    backgroundColorThree: 'rgba(255,255,255, 0.5)'
                })
            }
        }
        else{
            if (selectedOption == 'Studio') {
                this.setState({
                    backgroundColorOne: 'rgba(75,144,190, 0.5)',
                    backgroundColorTwo: 'rgba(75,144,190,0)',
                    backgroundColorThree: 'rgba(75,144,190, 0)'
                })
            } else if (selectedOption == '1 Bedroom') {
                this.setState({
                    backgroundColorOne: 'rgba(75,144,190, 0)',
                    backgroundColorTwo: 'rgba(75,144,190, 0.5)',
                    backgroundColorThree: 'rgba(75,144,190, 0)'
                })
            } else if (selectedOption == '2 Bedroom') {
                this.setState({
                    backgroundColorOne: 'rgba(75,144,190, 0)',
                    backgroundColorTwo: 'rgba(75,144,190, 0)',
                    backgroundColorThree: 'rgba(75,144,190, 0.5)'
                })
            }
        }

    }


    render() {
        const {backgroundColorOne, backgroundColorTwo, backgroundColorThree} = this.state
        let marginTop = -responsiveHeight(2)
        
        return (
            <View style={[styles.buttonsContainer, {marginTop: marginTop}]}>
                <TouchableHighlight underlayColor='rgba(255,255,255, 0.5)'
                                    style={[styles.priceButtons, {backgroundColor: backgroundColorOne}]}
                                    onPress={this.handlePriceSelection.bind(this, 'Studio')}><View/></TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(255,255,255, 0.5)'
                                    style={[styles.priceButtons, {backgroundColor: backgroundColorTwo}]}
                                    onPress={this.handlePriceSelection.bind(this, '1 Bedroom')}><View/></TouchableHighlight>
                <TouchableHighlight underlayColor='rgba(255,255,255, 0.5)'
                                    style={[styles.priceButtons, {backgroundColor: backgroundColorThree}]}
                                    onPress={this.handlePriceSelection.bind(this, '2 Bedroom')}><View/></TouchableHighlight>
            </View>
        )
    }
}

const styles = {
    priceButtons: {
        width: responsiveWidth(18),
        height: responsiveHeight(8),
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: responsiveWidth(69),
        height: responsiveHeight(8),
        marginBottom: responsiveHeight(23.9),
        justifyContent: 'space-around',
        marginLeft: responsiveHeight(0.6),
    },
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, {apartmentSelectionChanged})(HighlitedButton);

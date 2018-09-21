import React, {Component} from 'react';
import { Text, TouchableOpacity, View, TouchableHighlight } from 'react-native';
var Mailer = require('NativeModules').RNMail;

class Mail extends Component {
    handleHelp() {
        Mailer.mail({
        subject: 'need help',
        recipients: ['support@example.com'],
        ccRecipients: ['supportCC@example.com'],
        bccRecipients: ['supportBCC@example.com'],
        body: '',
        isHTML: true, // iOS only, exclude if false
        attachment: {
            path: '',  // The absolute path of the file from which to read data.
            type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
            name: '',   // Optional: Custom filename for attachment
        }
        }, (error, event) => {
            if(error) {
            AlertIOS.alert('Error', 'Could not send mail. Please send a mail to support@example.com');
            }
        });
    }
    render() {

        return (
            <TouchableHighlight
                onPress={this.handleHelp}
                underlayColor="#f7f7f7">
            <View style={styles.container}>
               
            </View>
        </TouchableHighlight>
        )}
}

const styles = {
	textStyle: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
		paddingTop: 10,
		paddingBottom: 10,
		fontFamily: 'PTSans-CaptionBold',
		letterSpacing: 2
	},
    container: {
        width: null,
        height: null,
        flex: 1
    },
    image: {
        flex: 1
    },
	viewStyle: {
		width: '100%',
		height: 45
	}
};

export default Mail;
import {AppRegistry, Text} from 'react-native';
import App from './src/app';
console.disableYellowBox = true;
Text.defaultProps.allowFontScaling=false
AppRegistry.registerComponent('SmooveKey', () => App);

import React, { PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Utils } from './Utils';
import Controls from './Controls';

export default function HeaderControls(props) {
  const {
    styles,
    initialDate,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    months,
    previousTitle,
    nextTitle,
    textStyle,
  } = props;
  const MONTHS = months? months : Utils.MONTHS; // English Month Array
  // getMonth() call below will return the month number, we will use it as the
  // index for month array in english
  const previous = previousTitle ? previousTitle : 'Previous';
  const next = nextTitle ? nextTitle : 'Next';
  const month = MONTHS[currentMonth];
  const year = currentYear;

  return (
    <View style={[styles.headerWrapper, {width: '106%'}]}>
      <View style={styles.monthSelector}>
        <Controls
          label={previous}
          onPressControl={onPressPrevious}
          styles={[styles.prev, {width: '100%', marginLeft: 20}]}
          textStyles={[textStyle, {fontWeight: 'bold', fontSize: 40, color: '#3d3d3d',  fontFamily: 'PTSans-Caption'}]}
        />
      </View>
      <View style = {{marginRight: -10}}>
        <Text style={[styles.monthLabel, textStyle, { fontFamily: 'PTSans-Caption', paddingRight: -15}]}>
           { month } { year }
        </Text>
      </View>
      <View style={styles.monthSelector}>
        <Controls
          label={next}
          onPressControl={onPressNext}
          styles={[styles.next, {width: '100%', marginLeft: 10}]}
          textStyles={[textStyle, {fontWeight: 'bold', fontSize: 40, color: '#3d3d3d',  fontFamily: 'PTSans-Caption'}]}
        />
      </View>
    </View>
  );
}

HeaderControls.propTypes = {
  initialDate: PropTypes.instanceOf(Date),
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
};

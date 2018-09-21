import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import firebase from 'firebase';
import {
  SELECTED_PACKAGE,
  APARTMENT_PRICE_CHANGED,
  APARTMENT_SELECTION_CHANGED,
  CITY_CHANGED,
  DAY_CHANGED,
  DATE_CHANGED,
  SHOW_MODAL,
  OLD_PASSWORD_CHANGED,
  CURRENT_PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  SHOW_PAYMENT_MODAL,
  SAVE_USER_TOKEN_STRIPE,
  CHANGE_SELECTED_PACKAGE,
  HIDE_SECOND_PAYMENT,
  FIRST_VISIT_COMPLETE,
  SAVE_RAW_DATES
} from './types';

export const saveRawDates = (dateArray) => {
  return {
    type: SAVE_RAW_DATES,
    payload: dateArray
  }
}

export const selectPremiumPackage = (userId) => {
  if (userId) {
    let database = firebase.database();
    database
      .ref('/user/' + userId)
      .update({package: 'Premium'});
  }
  return {type: SELECTED_PACKAGE, payload: 'Premium'}
}

export const firstVisitComplete = () => {
  return {type: FIRST_VISIT_COMPLETE}
}

export const hideSecondPaymentModal = () => {
  return {type: HIDE_SECOND_PAYMENT}
}

export const changeSelectedPackage = (thePackage) => {
  return {type: CHANGE_SELECTED_PACKAGE, payload: thePackage}
}

export const saveUserStripeToken = (theToken) => {
  return {type: SAVE_USER_TOKEN_STRIPE, payload: theToken}
}

export const oldPasswordChanged = (text) => {
  return {type: OLD_PASSWORD_CHANGED, payload: text}
}

export const currentPasswordChanged = (text) => {
  return {type: CURRENT_PASSWORD_CHANGED, payload: text}
}

export const confirmPasswordChanged = (text) => {
  return {type: CONFIRM_PASSWORD_CHANGED, payload: text}
}

export const showModal = (visible) => {
  return {type: SHOW_MODAL, payload: visible}
}

export const showPaymentModal = (visible) => {
  return {type: SHOW_PAYMENT_MODAL, payload: visible}
}

export const selectSmartPackage = (userId) => {
  if (userId) {
    let database = firebase.database();
    database
      .ref('/user/' + userId)
      .update({package: 'Smart'});
  }
  return {type: SELECTED_PACKAGE, payload: 'Smart'};
};

export const apartmentPriceChanged = (price) => {
  return {type: APARTMENT_PRICE_CHANGED, payload: price}
}

export const apartmentSelectionChanged = (selection) => {
  return {type: APARTMENT_SELECTION_CHANGED, payload: selection}
}

export const cityChanged = (cityArray) => {
  return {type: CITY_CHANGED, payload: cityArray}
}

export const dayChanged = (dayArray) => {
  return {type: DAY_CHANGED, payload: dayArray}
}

export const dateChanged = (date) => {
  return {type: DATE_CHANGED, payload: date}
}

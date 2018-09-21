import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import firebase from 'firebase';
import {
  SAVE_CLIENT_LIST,
  SAVE_CURRENT_CLIENT,
  SUGGESTED_DESCRIPTION,
  SUGGESTED_LOCATION,
  SUGGESTED_PRICE,
  CHAT_TEXT_CHANGED,
  SAVE_SUGGESTIONS,
  SET_NETWORK_STATUS
} from './types';

export const saveClientList = (list) => {
  return {type: SAVE_CLIENT_LIST, payload: list}
}

export const setNetworkStatus = (status) => {
  return {type: SET_NETWORK_STATUS, payload: status}
}

export const saveSuggestionList = (list) => {
  return {type: SAVE_SUGGESTIONS, payload: list.suggestions}
}

export const chatTextChanged = (text) => {
  return {type: CHAT_TEXT_CHANGED, payload: text}
}

export const saveCurrentClient = (currentClient, key) => {
  return {type: SAVE_CURRENT_CLIENT, payload: currentClient, clientsKey: key}
}

export const suggestedLocationChanged = (text) => {
  return {type: SUGGESTED_LOCATION, payload: text}
}

export const suggestedDescriptionChanged = (text) => {
  return {type: SUGGESTED_DESCRIPTION, payload: text}
}

export const suggestedPriceChanged = (text) => {
  return {type: SUGGESTED_PRICE, payload: text}
}

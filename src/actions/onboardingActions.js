import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import firebase from 'firebase';
import {
  NAME_CHANGED,
  EMAIL_CHANGED,
  VALIDATE_PASS_CHANGED,
  PASSWORD_CHANGED,
  UPLOADED_PHOTO,
  ID_SAVED,
  USER_INFO,
  SHOW_ERROR,
  RESET_GET_STARTED
} from './types';

export const resetGetStarted = () => {
  return {type: RESET_GET_STARTED}
}

export const userUploadedPhoto = (photo) => {
  return {type: UPLOADED_PHOTO, payload: photo}
}

export const showError = (errorCode) => {
  return {type: SHOW_ERROR, payload: errorCode}
}

export const saveUserInfo = (info, whereAt) => {
  return {type: USER_INFO, payload: info, typeOfUser: info.type, userLocationStorage: whereAt}
}

export const nameChanged = (text) => {
  return {type: NAME_CHANGED, payload: text};
};

export const emailChanged = (text) => {
  return {type: EMAIL_CHANGED, payload: text}
}

export const passwordChanged = (text) => {
  return {type: PASSWORD_CHANGED, payload: text}
}

export const validatePassChanged = (text) => {
  return {type: VALIDATE_PASS_CHANGED, payload: text}
}

export const saveUserId = (theId, theEmail, theType) => {
  return {type: ID_SAVED, payload: theId, email: theEmail, typeOfUser: theType}
}

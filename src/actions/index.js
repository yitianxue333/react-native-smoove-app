import {
  nameChanged,
  emailChanged,
  passwordChanged,
  validatePassChanged,
  userUploadedPhoto,
  saveUserId,
  saveUserInfo,
  showError,
  resetGetStarted
} from './onboardingActions'

import {
  selectPremiumPackage,
  selectSmartPackage,
  apartmentPriceChanged,
  apartmentSelectionChanged,
  cityChanged,
  dayChanged,
  dateChanged,
  showModal,
  oldPasswordChanged,
  currentPasswordChanged,
  confirmPasswordChanged,
  showPaymentModal,
  saveUserStripeToken,
  changeSelectedPackage,
  hideSecondPaymentModal,
  firstVisitComplete,
  saveRawDates
} from './getStartedActions'

import {
  saveClientList,
  saveCurrentClient,
  suggestedLocationChanged,
  suggestedPriceChanged,
  suggestedDescriptionChanged,
  chatTextChanged,
  saveSuggestionList,
  setNetworkStatus
} from './guideActions';

export {
  nameChanged,
  emailChanged,
  passwordChanged,
  validatePassChanged,
  userUploadedPhoto,
  selectSmartPackage,
  selectPremiumPackage,
  apartmentPriceChanged,
  apartmentSelectionChanged,
  cityChanged,
  dayChanged,
  dateChanged,
  saveUserId,
  saveUserInfo,
  showModal,
  oldPasswordChanged,
  currentPasswordChanged,
  confirmPasswordChanged,
  saveClientList,
  saveCurrentClient,
  suggestedLocationChanged,
  suggestedPriceChanged,
  suggestedDescriptionChanged,
  chatTextChanged,
  showPaymentModal,
  showError,
  saveUserStripeToken,
  saveSuggestionList,
  resetGetStarted,
  changeSelectedPackage,
  hideSecondPaymentModal,
  setNetworkStatus,
  firstVisitComplete,
  saveRawDates
}
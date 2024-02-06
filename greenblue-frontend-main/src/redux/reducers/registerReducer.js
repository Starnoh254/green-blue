const registrationState = {
  userExist: false,
  started: false, //WHEN  PROCESS STARTS
  ended: false, //UPDATE WHEN IT"S COMPLETE
  phone_verified: false, //AFTER AN OPT VEROIFICATION IS DONE
  email_verified: false, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  referrered_by: null,
  country: "",
  passwordSet: false,
  access_token: "",
};
const registerReducer = (state = registrationState, action) => {
  switch (action.type) {
    case "ADD_USER_STATES":
      return {
        ...state,
        userExist: action.payload.userExist,
        started: action.payload.started,
        ended: action.payload.ended,
        phone_verified: action.payload.phone_verified,
        email_verified: action.payload.email_verified,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        phone: action.payload.phone,
        email: action.payload.email,
        referrered_by: action.payload.referrered_by,
        country: action.payload.country,
        passwordSet: action.payload.passwordSet,
        access_token: action.payload.access_token,
      };
    case "CLEAR_STATES":
      return {
        ...state,
        userExist: false,
        started: false, //WHEN  PROCESS STARTS
        ended: false, //UPDATE WHEN IT"S COMPLETE
        phone_verified: false, //AFTER AN OPT VEROIFICATION IS DONE
        email_verified: false, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        referrered_by: null,
        country: "",
        passwordSet: false,
        access_token: "",
      };
    default:
      return state;
  }
};
export default registerReducer;

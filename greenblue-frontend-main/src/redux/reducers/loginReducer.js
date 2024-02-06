import {
  LOGIN_USER,
  LOGIN_USER_STATUS,
  LOGOUT_USER,
  SLICE_USER,
} from "../actions/types";
const loginState = {
  isLoggedIn: false,
  errorMessage: "",
  token: "",
};
const loginReducer = (state = loginState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
      };
    case LOGOUT_USER:
      return { ...state, isLoggedIn: false, token: "" };
    case LOGIN_USER_STATUS:
      return [...state, action.payload];
    case LOGOUT_USER:
      return state.filter((order) => order.id !== action.payload.id);
    case SLICE_USER:
      return state.slice(-1);
    default:
      return state;
  }
};
export default loginReducer;

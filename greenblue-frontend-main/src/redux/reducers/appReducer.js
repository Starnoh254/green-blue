import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import registerReducer from "./registerReducer";
const appReducer = combineReducers({
  loginReducer,
  registerReducer,
});
export default appReducer;

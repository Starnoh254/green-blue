import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import { connect } from "react-redux";
import Login from "./pages/autentication/Login";
import Register from "./pages/autentication/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CompleteRegistartion from "./pages/autentication/CompleteRegistartion";
import Profile from "./pages/profile/Profile";
import EWallet from "./pages/wallet/EWallet";
import Join from "./pages/autentication/Join";
import Genealogy from "./pages/genealogy/Genealogy";
import UserReferrals from "./pages/referrals/UserReferrals";
import Purchase from "./pages/purchase/Purchase";
import Transactions from "./pages/transactions/Transactions";
import Transfer from "./pages/transfers/Transfer";
import Settings from "./pages/settings/Settings";
import Support from "./pages/support/Support";
import Privacy from "./pages/Privacy";
import RegPrompt from "./pages/autentication/RegPrompt";
import SponsorForm from "./pages/autentication/SponsorForm";
const App = (props) => {
  const isLoggedIn = props.appState.loginReducer.isLoggedIn;
  // const isLoggedIn = true;
  return (
    <GoogleOAuthProvider clientId="265379233732-car2lqdttahi6rdib0hh7emq4liaqgdq.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Dashboard
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                  registerState={props.registerState}
                  clearRegState={props.clearRegState}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />

          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Dashboard
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                  registerState={props.registerState}
                  clearRegState={props.clearRegState}
                />
              ) : props.appState.registerReducer.started ? (
                <CompleteRegistartion
                  appState={props.appState}
                  clearRegState={props.clearRegState}
                  addUser={props.addUser}
                />
              ) : (
                <Register appState={props.appState} />
              )
            }
          />
          <Route
            path="/pre_register"
            element={<RegPrompt appState={props.appState} />}
          />
          <Route
            path="/sponsor/:type"
            element={<SponsorForm appState={props.appState} />}
          />
          <Route
            path="/complete_registration"
            element={
              isLoggedIn ? (
                <Dashboard
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                  registerState={props.registerState}
                  clearRegState={props.clearRegState}
                />
              ) : (
                <CompleteRegistartion
                  appState={props.appState}
                  clearRegState={props.clearRegState}
                  addUser={props.addUser}
                />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/e-wallet"
            element={
              isLoggedIn ? (
                <EWallet
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/join/:id"
            element={
              <Join
                registerState={props.registerState}
                appState={props.appState}
              />
            }
          />
          <Route
            path="/genealogy"
            element={
              isLoggedIn ? (
                <Genealogy
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/referrals"
            element={
              isLoggedIn ? (
                <UserReferrals
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/purchase"
            element={
              isLoggedIn ? (
                <Purchase
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              isLoggedIn ? (
                <Transactions
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/transfer"
            element={
              isLoggedIn ? (
                <Transfer
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <Settings
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
          <Route
            path="/support"
            element={
              isLoggedIn ? (
                <Support
                  appState={props.appState}
                  logoutUser={props.logoutUser}
                />
              ) : (
                <Login appState={props.appState} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (token) => dispatch({ type: "LOGIN_USER", payload: token }),
    logoutUser: (token) => dispatch({ type: "LOGOUT_USER" }),
    registerState: (data) =>
      dispatch({ type: "ADD_USER_STATES", payload: data }),
    clearRegState: () => dispatch({ type: "CLEAR_STATES" }),
  };
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

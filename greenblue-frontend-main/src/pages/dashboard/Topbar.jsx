import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Notification from "./notifications/Notification";
import { connect } from "react-redux";
const Topbar = (props) => {
  return (
    <div className="navbar  bg-base-100">
      <div className="flex-1">
        <label
          htmlFor="my-drawer"
          tabIndex={0}
          className="btn btn-ghost btn-circle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <a className="btn btn-ghost normal-case text-xl">
          <img
            className="place-self-center center"
            style={{ alignSelf: "center", width: 80 }}
            src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.png"
          />
        </a>
      </div>
      <div className="flex-none">
        <Notification />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile">
                <i class="fas fa-user-alt"></i>Profile
              </Link>
            </li>
            <li>
              <Link to="/settings">
                {" "}
                <i class="fas fa-user-cog"></i>Settings
              </Link>
            </li>
            <li>
              <a onClick={() => props.logoutUser()}>
                <i class="fas fa-sign-out-alt"></i>Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Topbar);

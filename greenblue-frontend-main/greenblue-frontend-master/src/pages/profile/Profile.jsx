import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import axios from "axios";
import Sidebar from "../dashboard/Sidebar";
import UserDetails from "./UserDetails";
import Topbar from "../dashboard/Topbar";
import Withdraw from "../wallet/Withdraw";
import { isMobile } from "react-device-detect";
const Profile = (props) => {
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  return (
    <div>
      <div>
        <Topbar />
        <div class=" shadow bg-base-200 drawer drawer-mobile">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div class="flex flex-col drawer-content">
            <div
              class="hidden lg:block "
              style={{
                backgroundColor: "#f6f7f8",
                height: "100vh",
                width: "100%",
                padding: 10,
              }}
            >
              <UserDetails appState={props.appState} />
              {/*
              <Withdraw /> */}
            </div>
            <div class=" lg:hidden p-2">
              <UserDetails appState={props.appState} />
            </div>
          </div>
          <div className="drawer-side" style={{ backgroundColor: "#f6f7f8" }}>
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            {isMobile ? (
              <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                <Sidebar logoutUser={props.logoutUser} />
              </ul>
            ) : (
              <Sidebar logoutUser={props.logoutUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

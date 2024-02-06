import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import UpdateForm from "./UpdateForm";
import { isMobile } from "react-device-detect";
const Settings = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <Topbar />
        <div class=" shadow bg-base-200 drawer drawer-mobile">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div class="flex flex-col drawer-content">
            {/* <label
              for="my-drawer-2"
              class="mb-4 btn btn-primary drawer-button lg:hidden"
            >
              open menu
            </label> */}
            <div
              class="hidden lg:block "
              style={{
                backgroundColor: "#f6f7f8",
                width: "100%",
                height: "100vh",
                padding: 10,
              }}
            >
              <h1 className="text-bold text-2xl p-2">My Account Settings</h1>
              {loading == false && (
                <div>
                  <UpdateForm
                    appState={props.appState}
                    user={user}
                    config={config}
                  />
                </div>
              )}
            </div>
            <div class=" lg:hidden p-2">
              {loading == false && (
                <div>
                  <UpdateForm
                    appState={props.appState}
                    user={user}
                    config={config}
                  />
                </div>
              )}
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

export default Settings;

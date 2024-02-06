import React, { useState, useEffect } from "react";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import useURL from "../../hooks/useURL";
import axios from "axios";
import TransferForm from "./TransferForm";
import TransferList from "./TransferList";
import { ToastContainer } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import { isMobile } from "react-device-detect";
const Transfer = (props) => {
  const [transfers, setTransfers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    initFunc();
  }, []);
  const initFunc = async () => {
    await getUserProfile();
    await getTransfer();
  };
  const getTransfer = async () => {
    setLoading(true);
    setTransfers([]);
    await axios.get(`${baseUrl}/api/v1/user/transfers`, config).then((res) => {
      //   console.log(res.data);
      setTransfers(res.data);
      setLoading(false);
    });
  };
  const getUserProfile = async () => {
    setLoading(true);
    await axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      // console.log(res.data);
      setUser(res.data);
    });
  };
  return (
    <div>
      <div>
        <Topbar />
        <ToastContainer />
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
              {loading == true ? (
                <div>
                  <ThreeDots
                    height="100"
                    width="100"
                    radius="9"
                    color="#8d949e"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-bold text-2xl p-4">Transfer Funds</h1>
                  <TransferForm
                    appState={props.appState}
                    user={user}
                    initFunc={initFunc}
                  />
                  <h1 className="text-bold text-2xl  p-2">Transfer Records</h1>
                  <TransferList
                    transfers={transfers}
                    user={user}
                    appState={props.appState}
                  />
                </div>
              )}
            </div>
            <div class="text-xs lg:hidden p-2">
              {loading == true ? (
                <div>
                  <ThreeDots
                    height="100"
                    width="100"
                    radius="9"
                    color="#8d949e"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-bold text-xl p-4">Transfer Funds</h1>
                  <TransferForm
                    appState={props.appState}
                    user={user}
                    initFunc={initFunc}
                  />
                  <h1 className="text-bold text-xl  p-2">Transfer Records</h1>
                  <TransferList
                    transfers={transfers}
                    user={user}
                    appState={props.appState}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="drawer-side" style={{ backgroundColor: "#f6f7f8" }}>
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            {isMobile ? (
              <ul
                className="menu p-4 w-80  text-base-content"
                style={{ backgroundColor: "#f6f7f8" }}
              >
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

export default Transfer;

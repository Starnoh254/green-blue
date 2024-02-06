import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashMain from "./DashMain";
import axios from "axios";
import useURL from "../../hooks/useURL";
import { useNavigate } from "react-router-dom";
import CompleteRegistration from "../autentication/CompleteRegistartion";
import UpdateAccount from "./UpdateAccount";
import VerifyNumber from "./VerifyNumber";
import Topbar from "./Topbar";
import ReferralInfo from "./ReferralInfo";
import { ToastContainer } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import LoadingOverlay from "react-loading-overlay";
import Grid from "../../Grid";
import { isMobile } from "react-device-detect";
const Dashboard = (props) => {
  const [user, setUser] = useState(null);
  const [trees, setTrees] = useState(0);
  const [status, setStatus] = useState(true);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState(null);
  const [stats, setStats] = useState({
    green_bonus: 0,
    blue_bonus: 0,
    earnings: 0,
    account_balance: 0,
    profit: 0,
    referrals: 2,
    active_referrals: 0,
    inactive_referrals: 2,
    commission_by_date: [],
  });
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    initFun();
  }, []);
  const initFun = async () => {
    await getregistrationStatus();
    await getStats();
    await getPackages();
    await getTrees();
  };
  let navigate = useNavigate();
  const getregistrationStatus = async () => {
    await axios
      .get(`${baseUrl}/api/v1/auth/register/stage`, config)
      .then((res) => {
        // setStatus(res.data);
        console.log(res.data);
        if (res.data.registration_is_complete.status == false) {
          setStatus(res.data.registration_is_complete.status);
          setUser(res.data);
          setPhone(res.data.phone);
          setLoading(false);
        } else {
          if (res.data.registration_fee_is_paid == false) {
            navigate("/purchase");
          }
          setPackages(res.data);
          setStatus(res.data.registration_is_complete.status);
          setUser(res.data);
          setPhone(res.data.phone);
          setLoading(false);
        }
      })
      .catch((err) => {
        props.logoutUser();
      });
  };
  const getStats = async () => {
    await axios
      .get(`${baseUrl}/api/v1/user/stats`, config)
      .then((res) => {
        // console.log(res);
        setStats(res.data);
      })
      .catch((err) => {
        props.logoutUser();
      });
  };
  const getTrees = async () => {
    await axios
      .get(`${baseUrl}/api/v1/user/trees`, config)
      .then((res) => {
        setTrees(res.data.total);
      })
      .catch((err) => {
        props.logoutUser();
      });
  };
  const getPackages = async () => {
    axios
      .get(`${baseUrl}/api/v1/user/packages`, config)
      .then((res) => {
        setPackages(res.data);
      })
      .catch((error) => props.logoutUser());
  };

  return (
    <LoadingOverlay
      active={loading}
      spinner={
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
      }
    >
      <div style={{ backgroundColor: "#f6f7f8" }}>
        {status ? (
          <div>
            <Topbar />
            <ToastContainer />
            <div class=" shadow bg-base-200 drawer drawer-mobile">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div class="flex flex-col drawer-content">
                <div
                  class="hidden lg:block "
                  style={{ backgroundColor: "#f6f7f8", width: "100%" }}
                >
                  <div style={{ padding: 0 }}>
                    {loading == false ? (
                      <div>
                        <DashMain
                          appState={props.appState}
                          stats={stats}
                          logoutUser={props.logoutUser}
                          packages={packages}
                          initFun={initFun}
                          trees={trees}
                        />
                        <ReferralInfo stats={stats} user={user} />
                      </div>
                    ) : (
                      <div>
                        <DashMain
                          appState={props.appState}
                          stats={stats}
                          logoutUser={props.logoutUser}
                          packages={packages}
                          initFun={initFun}
                          getStats={getStats}
                          trees={trees}
                        />
                        <Grid />
                      </div>
                    )}
                  </div>
                </div>
                <div class="text-xs lg:hidden">
                  {loading == false ? (
                    <div>
                      <DashMain
                        appState={props.appState}
                        stats={stats}
                        logoutUser={props.logoutUser}
                        packages={packages}
                        initFun={initFun}
                        getStats={getStats}
                        trees={trees}
                      />
                      <ReferralInfo stats={stats} user={user} />
                    </div>
                  ) : (
                    <div>
                      <DashMain
                        appState={props.appState}
                        stats={stats}
                        logoutUser={props.logoutUser}
                        packages={packages}
                        initFun={initFun}
                        getStats={getStats}
                        trees={trees}
                      />
                      <Grid />
                    </div>
                  )}
                </div>
              </div>
              <div
                className="drawer-side"
                style={{ backgroundColor: "#f6f7f8" }}
              >
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
        ) : (
          <div className="container mx-auto md:p-10">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Your Profile is incomplete</h2>
                <p>Please update your profile to proceed</p>
                {phone ? (
                  <UpdateAccount
                    phone={phone}
                    config={config}
                    user={user}
                    appState={props.appState}
                    clearRegState={props.clearRegState}
                    getregistrationStatus={getregistrationStatus}
                  />
                ) : (
                  <>
                    <VerifyNumber
                      setPhone={setPhone}
                      user={user}
                      appState={props.appState}
                      clearRegState={props.clearRegState}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
};
export default Dashboard;

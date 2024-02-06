import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import AccountStat from "./AccountStat";
import Withdraw from "./Withdraw";
import WithdrawForm from "./WithdrawForm";
import WithdrawalsList from "./WithdrawalsList";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { isMobile } from "react-device-detect";
const EWallet = (props) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    completed: 0,
    processing: 0,
    account_balance: 0,
  });
  const token = props.appState.loginReducer.token;
  // console.log(token);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getStats();
    getWithdrawals();
    getUserProfile();
  }, [withdrawals.length]);

  const getWithdrawals = async () => {
    axios.get(`${baseUrl}/api/v1/withdrawals`, config).then((res) => {
      setWithdrawals(res.data);
    });
  };
  const getStats = async () => {
    axios.get(`${baseUrl}/api/v1/withdrawals/stats`, config).then((res) => {
      setStats(res.data);
      // console.log(res.data);
    });
  };
  const getUserProfile = async () => {
    axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      // console.log(res.data);
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
              <h1 className="text-bold text-2xl p-2">Wallet & Withdrawals</h1>

              <div className="grid md:grid-cols-2 md:gap-2 ">
                <AccountStat stats={stats} />
                <WithdrawForm
                  getWithdrawals={getWithdrawals}
                  stats={stats}
                  user={user}
                />
              </div>
              <WithdrawalsList withdrawals={withdrawals} />
            </div>
            <div class=" lg:hidden p-2">
              <div>
                <AccountStat stats={stats} />
                <WithdrawForm
                  getWithdrawals={getWithdrawals}
                  stats={stats}
                  user={user}
                />
              </div>

              <WithdrawalsList withdrawals={withdrawals} />
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

export default EWallet;

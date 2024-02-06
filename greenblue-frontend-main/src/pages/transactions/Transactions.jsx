import React, { useState, useEffect } from "react";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import TransactionsList from "./TransactionsList";
import useURL from "../../hooks/useURL";
import axios from "axios";
import TransactionsStats from "./TransactionStats";
import { isMobile } from "react-device-detect";
import { ThreeDots } from "react-loader-spinner";

const Transactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    transactions: [],
    commissions: [],
    withdrawals: [],
  });
  const [loading, setLoading] = useState(true);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getTransactions();
  }, []);
  const getTransactions = async () => {
    axios.get(`${baseUrl}/api/v1/user/transactions`, config).then((res) => {
      // console.log(res.data);
      setTransactions(res.data.transactions);
      setStats(res.data);
      setLoading(false);
    });
  };
  return (
    <div style={{ backgroundColor: "#f6f7f8" }}>
      <Topbar />
      <div class=" shadow bg-base-200 drawer drawer-mobile">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div class="flex flex-col drawer-content">
          <div
            class="hidden lg:block "
            style={{ backgroundColor: "#f6f7f8", width: "100%" }}
          >
            <div style={{ padding: 10 }}>
              <h1 className="text-bold text-2xl p-2">
                Account Transaction Statement
              </h1>
              {loading ? (
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
                  <TransactionsStats
                    transactions={transactions}
                    stats={stats}
                  />
                  <br />
                  <TransactionsList
                    transactions={transactions}
                    appState={props.appState}
                  />
                </div>
              )}
            </div>
          </div>
          <div class="text-xs lg:hidden p-2">
            {loading ? (
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
                <TransactionsStats transactions={transactions} stats={stats} />
                <br />
                <TransactionsList
                  transactions={transactions}
                  appState={props.appState}
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
  );
};

export default Transactions;

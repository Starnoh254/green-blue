import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import useURL from "../../hooks/useURL";
import axios from "axios";
import Packages from "./Packages";
import { ToastContainer } from "react-toastify";
import Payments from "./Payments";
import { isMobile } from "react-device-detect";
import Registration from "./Registration";
const Purchase = (props) => {
  const [depositrate, setDepositRate] = useState(null);
  const [currency, setCurrency] = useState("");
  const [rate, setRate] = useState(null);
  const [user, setUser] = useState(null);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [user_packages, setUserPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pack, setPack] = useState("");
  const [step, setStep] = useState(1);
  const nextStep = async () => {
    setStep(step + 1);
  };
  const prevStep = async () => {
    setStep(step - 1);
  };
  const [choosen_method, setChoosenMethod] = useState(null);
  const token = props.appState.loginReducer.token;
  // console.log(token);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    initPurchase();
  }, []);
  const initPurchase = async () => {
    await getPacks();
    await getRates();
    await getPayments();
    await getCurrencies();
    await getUser();
  };
  const getUser = async () => {
    await axios
      .get(`${baseUrl}/api/v1/profile`, config)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPacks = async () => {
    await axios
      .get(`${baseUrl}/api/v1/user/packages`, config)
      .then((res) => {
        // console.log(res.data);
        setPacks(res.data.packages);
        setUserPackages(
          res.data.user_packages.length == 0 ? [] : res.data.user_packages
        );
      })
      .catch((error) => props.logoutUser());
  };

  const getRates = async () => {
    await axios
      .get(`${baseUrl}/api/v1/constants/trade_rates`, config)
      .then((res) => {
        // console.log(res.data.deposit_percentage_rate_margin);
        setDepositRate(res.data.deposit_percentage_rate_margin);
      });
  };
  const getCurrencies = async () => {
    await axios
      .get(`${baseUrl}/api/v1/currencies`, config)
      .then((res) => {
        setCurrency(res.data.currency_symbol);
        setRate(Number(res.data.rate_usd).toFixed(2));

        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPayments = async () => {
    await axios
      .get(`${baseUrl}/api/v1/payments`, config)
      .then((res) => setPayments(res.data));
  };
  return (
    <>
      {user !== null && user.registration_fee_is_paid == false ? (
        <div>
          <ToastContainer />
          <Registration
            user={user}
            getUser={getUser}
            currency={currency}
            rate={rate}
            deposit_rate={depositrate}
          />
        </div>
      ) : (
        <div>
          <ToastContainer />
          <div>
            <Topbar />
            <div class=" shadow bg-base-200 drawer drawer-mobile">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div class="flex flex-col drawer-content">
                <div
                  class="hidden lg:block "
                  style={{
                    backgroundColor: "#f6f7f8",
                    width: "100%",
                    height: "100vh",
                    padding: 10,
                  }}
                >
                  <div style={{ padding: 10 }}>
                    <Packages
                      currency={currency}
                      rate={rate}
                      deposit_rate={depositrate}
                      packs={packs}
                      loading={loading}
                      payment={payment}
                      setPayment={setPayment}
                      user={user}
                      getPayments={getPayments}
                      step={step}
                      setStep={setStep}
                      nextStep={nextStep}
                      prevStep={prevStep}
                      choosen_method={choosen_method}
                      setChoosenMethod={setChoosenMethod}
                      setPack={setPack}
                      pack={pack}
                      user_packages={user_packages}
                      appState={props.appState}
                    />
                    <Payments
                      payments={payments}
                      packs={packs}
                      setPayment={setPayment}
                      setStep={setStep}
                      setPack={setPack}
                      pack={setPack}
                      choosen_method={choosen_method}
                      setChoosenMethod={setChoosenMethod}
                    />
                  </div>
                </div>
                <div class=" lg:hidden">
                  <div style={{ padding: 5 }}>
                    <Packages
                      currency={currency}
                      rate={rate}
                      deposit_rate={depositrate}
                      packs={packs}
                      loading={loading}
                      payment={payment}
                      setPayment={setPayment}
                      user={user}
                      getPayments={getPayments}
                      step={step}
                      setStep={setStep}
                      nextStep={nextStep}
                      prevStep={prevStep}
                      choosen_method={choosen_method}
                      setChoosenMethod={setChoosenMethod}
                      setPack={setPack}
                      pack={pack}
                      user_packages={user_packages}
                      appState={props.appState}
                    />
                    <Payments
                      payments={payments}
                      packs={packs}
                      setPayment={setPayment}
                      setStep={setStep}
                      setPack={setPack}
                      pack={setPack}
                      choosen_method={choosen_method}
                      setChoosenMethod={setChoosenMethod}
                    />
                  </div>
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
        </div>
      )}
    </>
  );
};

export default Purchase;

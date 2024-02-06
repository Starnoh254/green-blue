import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import { toast } from "react-toastify";
import OTPPopups from "../popups/OTPPopup";
import io from "socket.io-client";

const WithdrawForm = (props) => {
  const [amount, setAmount] = useState(0.0);
  const [currency, setCurrency] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [send_otp, setSendOPT] = useState(false);
  const [is_opened, setOpened] = useState(false);
  const [otp, setOTP] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verify_status, verifyStatus] = useState(false);
  const stats = props.stats;
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl, baseWss } = useURL();
  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setOTP(code);
    getCurrencies();
  }, []);
  const openConnection = async () => {
    const socket = io.connect(`${baseWss}`);
    socket.on("withdrawal-response", function (data) {
      // console.log(data);
      if (data.Result.ResultCode == 0) {
        //SUCCESS
        toast.success(
          `${data.Result.TransactionID} Confirmed. ${data.Result.ResultDesc}`,
          {
            theme: "colored",
          }
        );
        closeConnection();
      } else {
        //FAILDED
        toast.error(
          `Transaction ${data.Result.TransactionID} failed, ${data.Result.ResultDesc}`,
          {
            theme: "colored",
          }
        );
        props.getWithdrawals();
        closeConnection();
      }
    });
  };
  const closeConnection = async () => {
    const socket = io.connect(`${baseWss}`);
    socket.off("withdrawal-response");
    socket.disconnect();
  };
  const getCurrencies = async () => {
    axios
      .get(`${baseUrl}/api/v1/currencies`, config)
      .then((res) => {
        setCurrency(res.data.currency_symbol);
        getRates(Number(res.data.rate_usd).toFixed(2));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getRates = async (rate) => {
    await axios
      .get(`${baseUrl}/api/v1/constants/trade_rates`, config)
      .then((res) => {
        //SET NEW RATE
        const margin =
          (Number(rate) * Number(res.data.withdrawal_percentage_rate_margin)) /
          100;
        const newRate = Number(rate) - margin;
        setRate(Number(newRate).toFixed(2));
        setLoading(false);
      });
  };
  const withdraw = async () => {
    openConnection();
    setSubmitting(true);
    setOpened(false);
    const margin = rate * 0.05;
    const data = {
      usd_amount: amount,
      local_currency: currency,
      amt_in_local_currency: Number(amount * rate).toFixed(2),
      payout_method: "M-Pesa",
      usd_rate: rate,
      margin: margin,
      usd_rate_on_margin: rate - margin,
      status: "processing",
      is_completed: false,
      desc: "withdrawal initialized from client dashboard",
    };
    axios.post(`${baseUrl}/api/v1/withdraw`, data, config).then((res) => {
      setSubmitting(false);
      setAmount(0);
      toast.success(
        `Withdrawal has been submitted for processing, please hold for instant settlement`,
        {
          theme: "colored",
        }
      );
    });
  };
  return (
    <div>
      <div className="card w-full bg-base-100 shadow md:mt-0 mt-4 md:p-2 p-0">
        <div className="card-body md:p-6 p-2">
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Enter Amount to Withdraw</span>
              <span className="label-text-alt">
                1USD = {rate} {currency}
              </span>
            </label>
            <input
              type="number"
              value={amount}
              placeholder="Enter amount"
              className="input input-bordered w-full"
              onChange={() => setAmount(event.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">{amount} USD</span>
              <span className="label-text-alt">
                = {currency} {Number(amount * rate).toFixed(2)}
              </span>
            </label>
          </div>
          <div className="card-actions justify-end">
            {verify_status == true ? (
              <button
                htmlFor="my-modal-3"
                disabled={amount > stats.account_balance ? true : submitting}
                className={`btn ${submitting && "loading"} btn-success`}
                onClick={() => withdraw()}
              >
                Withdraw
              </button>
            ) : (
              <label
                className={`btn ${submitting && "loading"} btn-success`}
                disabled={
                  amount > stats.account_balance
                    ? true
                    : amount == 0
                    ? true
                    : submitting
                }
                htmlFor="my-modal-3"
                onClick={() => {
                  setOpened(true);
                  setSendOPT(true);
                }}
              >
                Verify Withdrawal
              </label>
            )}

            {/* Put this part before </body> tag */}
            <input
              checked={is_opened}
              type="checkbox"
              id="my-modal-3"
              className="modal-toggle"
            />
            <div className="modal">
              <div className="modal-box relative">
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                  onClick={() => setOpened(false)}
                >
                  ✕
                </label>
                <h3 className="text-lg font-bold">Verify Withdrawal</h3>
                <OTPPopups
                  verifyStatus={verifyStatus}
                  phone={props.user.phone}
                  send_otp={send_otp}
                  otp={otp}
                  verify_status={verify_status}
                  nextComp={
                    <button
                      disabled={
                        amount > stats.account_balance ? true : submitting
                      }
                      className={`btn ${submitting && "loading"} btn-success`}
                      onClick={() => withdraw()}
                    >
                      Withdraw
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(WithdrawForm);

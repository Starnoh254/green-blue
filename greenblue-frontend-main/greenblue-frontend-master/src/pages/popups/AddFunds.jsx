import React, { useState, useEffect } from "react";
import MPesaDeposit from "./MPesaDeposit";
import CardDepsoit from "./CardDeposit";
import { connect } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import useURL from "../../hooks/useURL";
import axios from "axios";

const AddFunds = (props) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [depositrate, setDepositRate] = useState(0);
  const [amount, setAmount] = useState(0.0);
  const [local_amount, setLocalAmount] = useState(0);
  const [currency, setCurrency] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [next, setContinue] = useState(false);

  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl, baseWss } = useURL();
  useEffect(() => {
    getCurrencies();
  }, []);

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
        setDepositRate(res.data.deposit_percentage_rate_margin);
        //SET NEW RATE
        const margin =
          (Number(rate) * Number(res.data.deposit_percentage_rate_margin)) /
          100;
        const newRate = Number(rate) + margin;
        setRate(Number(newRate).toFixed(2));
        setLoading(false);
      });
  };
  return (
    <div>
      <label
        htmlFor="my-modal-3"
        className="btn md:btn-sm btn-xs md:text-md text-xs"
      >
        Add Funds
      </label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal w-p6 ">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg  font-bold">Select Payment Method</h3>
          <br />
          <div
            className="tabs"
            style={{ width: "100%", fontWeight: "600", fontSize: 12 }}
          >
            <a
              className={`tab tab-lifted ${
                paymentMethod == "mpesa" && "tab-active"
              }`}
              onClick={() => setPaymentMethod("mpesa")}
              style={{ width: "50%", fontWeight: "600" }}
            >
              M-Pesa
            </a>
            <a
              className={`tab  tab-lifted ${
                paymentMethod != "mpesa" && "tab-active"
              }`}
              onClick={() => setPaymentMethod("card")}
              style={{ width: "50%", fontWeight: "600" }}
            >
              Visa/Mastercard
            </a>
          </div>
          <div className="mt-5">
            {loading == false ? (
              <div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text">
                      Enter amount to deposit in USD
                    </span>
                    <span className="label-text-alt">
                      1USD = {rate} {currency}
                    </span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    placeholder="Enter amount"
                    className="input input-bordered w-full"
                    onChange={() => {
                      setAmount(event.target.value);
                      setLocalAmount(
                        Number(event.target.value * rate).toFixed(2)
                      );
                    }}
                    disabled={next}
                  />
                  <label className="label">
                    <span className="label-text-alt">{amount} USD</span>
                    <span className="label-text-alt">
                      = {currency} {Number(amount * rate).toFixed(2)}
                    </span>
                  </label>
                </div>
                {!next ? (
                  <button
                    htmlFor="my-modal-3"
                    className={`btn ${loading && "loading"} ${
                      paymentMethod == "mpesa" ? "btn-success" : "btn-warning"
                    } `}
                    onClick={() => setContinue(true)}
                  >
                    Deposit Via {paymentMethod == "mpesa" ? "M-Pesa" : "Card"}
                  </button>
                ) : (
                  <div>
                    {paymentMethod == "mpesa" ? (
                      <MPesaDeposit
                        paymentMethod={paymentMethod}
                        currency={currency}
                        amount={local_amount}
                        usd_amount={amount}
                        appState={props.appState}
                      />
                    ) : (
                      <CardDepsoit
                        paymentMethod={paymentMethod}
                        currency={currency}
                        amount={local_amount}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
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
            )}
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
export default connect(mapStateToProps)(AddFunds);

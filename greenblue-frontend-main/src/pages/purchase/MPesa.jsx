import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import { toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import io from "socket.io-client";
const MPesa = (props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const PhoneInput = PI.default ? PI.default : PI;
  const amount = Number(props.payment.amount) * Number(props.rate);
  const { baseUrl, baseWss } = useURL();
  const pushStk = async () => {
    const payment = props.payment;
    setLoading(true);
    const url = `${baseUrl}/api/v1/stkPush`;
    await axios
      .post(url, {
        amount: amount,
        phone: value,
        code: payment.ref_code,
        payment_id: payment._id,
      })
      .then((res) => {
        openConnection();
        setLoading(false);
        toast.success(res.data.message.CustomerMessage, {
          theme: "colored",
        });
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const openConnection = async () => {
    const socket = io.connect(`${baseWss}`);
    socket.on("mpesa-response", function (data) {
      if (data.ResultCode == 0) {
        //SUCCESS
        toast.success(
          "M-Pesa payment processed successfully.You are being redirected",
          {
            theme: "colored",
          }
        );
        props.setStep(4);
        props.getPayments();
        closeConnection();
      } else {
        //FAILED
        toast.error(
          "An error has occurred while processing the mpesa request. Please retry",
          {
            theme: "colored",
          }
        );
        closeConnection();
      }
    });
  };
  const closeConnection = async () => {
    const socket = io.connect(`${baseWss}`);
    socket.off("mpesa-response");
    socket.disconnect();
  };

  return (
    <div className="grid md:grid-cols-2 md:gap-2 ">
      <div>
        <h1 className="text-bold text-xl">Pay Via M-Pesa</h1>
        <p>Enter your Phone Number to Pay</p>
        <br />
        <PhoneInput
          country={"ke"}
          autoFormat={true}
          placeholder="Enter phone number"
          value={value}
          onChange={(phone) => setValue(phone)}
          inputStyle={{ width: "100%" }}
        />
        <br />
        <button
          onClick={
            value.length < 12
              ? () =>
                  toast.error("Please enter a valid number", {
                    theme: "colored",
                  })
              : () => pushStk()
          }
          className={`btn ${loading && "loading"}  btn-success`}
        >
          Pay Using M-Pesa
        </button>
      </div>
      <div>
        <div className="card w-full bg-base-100 card-bordered	mt-2">
          <div className="card-body">
            <h2 className="card-title">Amount to Pay</h2>
            <p style={{ fontSize: 11 }}>
              1 USD = {props.rate} {props.currency}
            </p>
            <p>
              <strong>
                {props.payment.amount} USD ={Number(amount).toFixed(2)}{" "}
                {props.currency}
              </strong>
            </p>
            <br />
            <p>
              NB: This amount might change depending on the price of the dollar
              at the time of your subscription
            </p>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(MPesa);

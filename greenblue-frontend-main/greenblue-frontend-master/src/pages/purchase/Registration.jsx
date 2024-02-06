import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import { toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import io from "socket.io-client";

const Registration = (props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const PhoneInput = PI.default ? PI.default : PI;
  const rate = props.rate;
  const [new_rate, setNewRate] = useState(rate);
  const [amount, setAmount] = useState(0);
  const depositrate = props.deposit_rate;
  const currency = props.currency;

  const { baseUrl, baseWss } = useURL();
  useEffect(() => {
    newRate();
  }, []);
  const pushStk = async () => {
    const payment = props.payment;
    setLoading(true);
    const url = `${baseUrl}/api/v1/stkPushReg`;
    await axios
      .post(url, {
        amount: amount,
        phone: value,
        code: props.user.account_number,
        user_id: props.user._id,
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
    socket.on("mpesa-reg", function (data) {
      if (data.ResultCode == 0) {
        //SUCCESS
        toast.success(
          "M-Pesa payment processed successfully.You are being redirected",
          {
            theme: "colored",
          }
        );
        props.getUser();
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
  const newRate = async () => {
    const margin = (Number(props.rate) * Number(props.deposit_rate)) / 100;
    const newRate = Number(props.rate) + margin;
    setNewRate(Number(newRate).toFixed(2));
    setAmount(Number(newRate).toFixed(0));
  };
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center ">
        <div className="card md:w-96 w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-center text-2xl">Registration Fee</h2>
            <p>
              You are required to pay a registration fee of 5 USD before you
              continue
            </p>
            <p>
              1 USD = {props.currency} {new_rate}
            </p>
            <p>
              5 USD = {props.currency} {amount}
            </p>
            <br />
            <p>Enter your M-Pesa Phone Number</p>
            <PhoneInput
              country={"ke"}
              autoFormat={true}
              placeholder="Enter phone number"
              value={value}
              onChange={(phone) => setValue(phone)}
              inputStyle={{ width: "100%" }}
            />
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
        </div>
      </div>
    </div>
  );
};

export default Registration;

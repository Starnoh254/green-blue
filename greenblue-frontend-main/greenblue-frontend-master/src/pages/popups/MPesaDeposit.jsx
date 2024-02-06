import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import { toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const MPesaDeposit = (props) => {
  let navigate = useNavigate();

  const amount = props.amount;
  const PhoneInput = PI.default ? PI.default : PI;
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const paymentMethod = props.paymentMethod;
  const { baseUrl, baseWss } = useURL();
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const generateCode = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const openConnection = async () => {
    const socket = io.connect(`${baseWss}`);
    socket.on("mpesa-response", function (data) {
      if (data.ResultCode == 0) {
        //SUCCESS
        toast.success(
          "M-Pesa payment processed successfully. Amount has been added to your account",
          {
            theme: "colored",
          }
        );
        closeConnection();
        window.location.reload();
      } else {
        //FAILED
        toast.error(
          "An error has occurred while processing the mpesa request. Please try again",
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
  const createPayment = async (value) => {
    openConnection();
    setLoading(true);
    const code = await generateCode(100000, 9999999);
    const data = {
      method: "M-Pesa",
      method_id: "mpesa",
      ref_code: code,
      amount2: amount,
      amount: props.usd_amount,
      currency: "KES",
    };
    axios
      .post(`${baseUrl}/api/v1/deposits/new`, data, config)
      .then((res) => {
        pushStk(res.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const pushStk = async (data) => {
    const url = `${baseUrl}/api/v1/deposits/stkPush`;
    const data1 = {
      amount: amount,
      phone: value,
      code: data.ref_code,
      deposit_id: data._id,
    };
    await axios
      .post(url, data1)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message.CustomerMessage, {
          theme: "colored",
        });
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <div className="mt-5">
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
        htmlFor="my-modal-3"
        className={`btn w-full ${loading && "loading"} ${
          paymentMethod == "mpesa" ? "btn-success" : "btn-warning"
        } `}
        onClick={() => createPayment()}
      >
        Deposit {amount} {props.currency}
      </button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(MPesaDeposit);

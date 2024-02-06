import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { isMobile } from "react-device-detect";
const payment_methods = [
  {
    name: "M-Pesa",
    logo: "https://res.cloudinary.com/hzurp2z3v/image/upload/v1681125396/49e82a05b1e55bff89da663c76e4b4fc_brprua.jpg",
    desc: "Pay instantly using M-Pesa",
    id: "mpesa",
  },
  {
    name: "Visa/MasterCard",
    logo: "https://res.cloudinary.com/hzurp2z3v/image/upload/v1681125368/Untitled_design_12_pfdur0.png",
    desc: "Pay instantly using Visa/MasterCard or American Express",
    id: "card",
  },
  {
    name: "Account Balance",
    logo: "https://res.cloudinary.com/hzurp2z3v/image/upload/v1681125443/wallet-3912327_1280_ppzfvb.webp",
    desc: "User your acount balance to pay for the package",
    id: "balance",
  },
];
const PaymentMethod = (props) => {
  const [loading, setLoading] = useState(false);
  const chooseMethod = async (value) => {
    setLoading(true);
    await createPayment(value);
  };
  const pack = props.pack;
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  const generateCode = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const createPayment = async (value) => {
    const code = await generateCode(100000, 9999999);
    const margin = (Number(props.rate) * Number(props.deposit_rate)) / 100;
    const newRate = parseFloat(props.rate) + margin;
    const useRate = Number(newRate).toFixed(2);
    const amount = Number(props.pack.amount) * useRate;
    console.log(amount);
    const data = {
      package_id: pack._id,
      method: value.name,
      method_id: value.id,
      ref_code: code,
      amount2: amount,
      currency: props.currency,
    };
    axios
      .post(`${baseUrl}/api/v1/payments/new`, data, config)
      .then((res) => {
        props.setPayment(res.data);
        props.setChoosenMethod(value.id);
        props.nextStep();
        setLoading(false);
        props.getPayments();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div className="grid md:grid-cols-3 md:gap-2 ">
      {payment_methods.map((payment_method) => {
        return (
          <div
            className={`card ${
              isMobile && "card-side mt-4"
            } card-bordered	 bg-base-400 p-2`}
          >
            <figure>
              <img
                style={{
                  width: isMobile ? 50 : 100,
                  height: isMobile ? 50 : 100,
                  borderRadius: 100,
                }}
                src={payment_method.logo}
                alt={payment_method.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{payment_method.name}</h2>
              <p>{payment_method.desc}</p>
              <div className="card-actions justify-end">
                <button
                  className={`btn btn-sm btn-success ${loading && "loading"}`}
                  onClick={() => chooseMethod(payment_method)}
                  disabled={
                    payment_method.id == "mpesa"
                      ? props.currency != "KES"
                        ? true
                        : false
                      : false
                  }
                >
                  Use {payment_method.name}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div></div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(PaymentMethod);

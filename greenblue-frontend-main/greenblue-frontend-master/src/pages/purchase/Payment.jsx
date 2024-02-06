import React, { useState, useEffect } from "react";
import MPesa from "./MPesa";
import FlutterWave from "./FlutterWave";
import UseBalance from "./UseBalance";
const Payment = (props) => {
  const choosen_method = props.choosen_method;
  //   console.log(choosen_method);
  const [rate, setRate] = useState(null);
  const pack = props.pack;
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    newRate();
  }, [props.deposit_rate]);
  const newRate = async () => {
    const margin = (Number(props.rate) * Number(props.deposit_rate)) / 100;
    const newRate = Number(props.rate) + margin;
    setRate(Number(newRate).toFixed(2));
    const amount = newRate * pack.amount;
    setAmount(amount);
  };
  const getPayments = props.getPayments;
  const setStep = props.setStep;

  return (
    <>
      {choosen_method == "mpesa" && (
        <MPesa
          amount={amount}
          rate={rate}
          currency={props.currency}
          payment={props.payment}
          getPayments={getPayments}
          setStep={props.setStep}
        />
      )}
      {choosen_method == "card" && (
        <FlutterWave
          amount={amount}
          rate={rate}
          currency={props.currency}
          pack={pack}
          payment={props.payment}
          getPayments={getPayments}
          setStep={props.setStep}
          user={props.user}
        />
      )}
      {choosen_method == "balance" && (
        <UseBalance
          pack={pack}
          payment={props.payment}
          getPayments={getPayments}
          setStep={props.setStep}
        />
      )}
    </>
  );
};

export default Payment;

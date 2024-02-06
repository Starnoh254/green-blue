import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import ChoosePack from "./ChoosePack";
import PaymentMethod from "./PaymentMethod";
import Payment from "./Payment";
import Complete from "./Complete";

const Packages = (props) => {
  const packs = props.packs;
  const step = props.step;
  const setStep = props.setStep;
  const choosen_method = props.choosen_method;
  const setChoosenMethod = props.setChoosenMethod;
  const nextStep = props.nextStep;
  const prevStep = props.prevStep;
  const pack = props.pack;
  const setPack = props.setPack;
  const user_packages = props.user_packages;
  return (
    <>
      {props.loading ? (
        <div
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        <div className="card w-full bg-base-100 shadow">
          <div className="card-body md:p-8 p-2">
            <h2 className="card-title ">Purchasing a package</h2>
            <ul className="steps w-full steps-horizontal">
              <li
                data-content={step > 1 ? "✓" : "●"}
                className="step text-xs step-success"
              >
                Choose Package
              </li>
              <li
                data-content={step > 2 ? "✓" : "●"}
                className={`step text-xs ${step >= 2 && "step-success"}`}
              >
                Choose Payment Method
              </li>
              <li
                data-content={step > 3 ? "✓" : "●"}
                className={`step text-xs ${step >= 3 && "step-success"}`}
              >
                Pay
              </li>
              <li
                data-content={step > 4 ? "✓" : "●"}
                className={`step text-xs ${step >= 4 && "step-success"}`}
              >
                Package Activation
              </li>
            </ul>
            <div className="md:p-16">
              {step == 1 && (
                <ChoosePack
                  nextStep={nextStep}
                  prevStep={prevStep}
                  setStep={setStep}
                  setPack={setPack}
                  packs={packs}
                  currency={props.currency}
                  rate={props.rate}
                  deposit_rate={props.deposit_rate}
                  user={props.user}
                  getPayments={props.getPayments}
                  user_packages={user_packages}
                  appState={props.appState}
                />
              )}
              {step == 2 && (
                <PaymentMethod
                  nextStep={nextStep}
                  prevStep={prevStep}
                  setStep={setStep}
                  setPack={setPack}
                  packs={packs}
                  currency={props.currency}
                  rate={props.rate}
                  pack={pack}
                  deposit_rate={props.deposit_rate}
                  setChoosenMethod={setChoosenMethod}
                  setPayment={props.setPayment}
                  getPayments={props.getPayments}
                />
              )}
              {step == 3 && (
                <Payment
                  pack={pack}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  currency={props.currency}
                  rate={props.rate}
                  deposit_rate={props.deposit_rate}
                  choosen_method={choosen_method}
                  payment={props.payment}
                  getPayments={props.getPayments}
                  setStep={setStep}
                  user={props.user}
                />
              )}
              {step == 4 && (
                <Complete
                  payment={props.payment}
                  getPayments={props.getPayments}
                  user={props.user}
                  appState={props.appState}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Packages;

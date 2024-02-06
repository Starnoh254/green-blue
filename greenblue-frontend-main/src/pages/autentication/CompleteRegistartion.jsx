import React, { useState, useEffect } from "react";
import InitRegistartion from "./InitRegistration";
import EmailVerify from "./EmailVerify";
import RegisterForm from "./RegisterForm";
import { toast, ToastContainer } from "react-toastify";
import { isMobile } from "react-device-detect";
const CompleteRegistration = (props) => {
  const registration = props.appState.registerReducer;
  return (
    <div>
      {isMobile ? (
        <div className="bg-white">
          <div className="card-body p-2 items-center text-center">
            <ul className="steps">
              <li
                className={`step text-xs ${
                  registration.phone_verified && "step-success"
                }`}
              >
                Phone Verified
              </li>
              <li
                className={`step text-xs ${
                  registration.email_verified && "step-success"
                }`}
              >
                Email Verified
              </li>
              <li
                className={`step  text-xs ${
                  registration.passwordSet && "step-success"
                }`}
              >
                Primary Details
              </li>
              <li
                className={`step text-xs ${
                  registration.ended && "step-success"
                }`}
              >
                Account Creation
              </li>
            </ul>
            {/* <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
          </div>
          <div className=" p-4">
            <h1 className="text-xl text-bold">Complete Registration</h1>
            {registration.phone_verified == false ? (
              <InitRegistartion />
            ) : (
              <div>
                {registration.email_verified == false ? (
                  <EmailVerify registration={registration} />
                ) : (
                  <div>
                    <RegisterForm
                      registration={registration}
                      clearRegState={props.clearRegState}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <ToastContainer />

          <div className="grid md:grid-cols-2 md:gap-2 min-h-screen bg-white">
            <div
              className="min-h-screen"
              style={{
                backgroundImage:
                  "url(https://res.cloudinary.com/hzurp2z3v/image/upload/v1680454356/green-forest_lowb3t.jpg)",
              }}
            >
              <div
                className="flex items-center justify-center h-screen"
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              >
                <div className="card  bg-transparent text-primary">
                  <figure className="px-10 pt-10">
                    <div className="avatar">
                      <div className="w-24 mask mask-squircle bg-green">
                        <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">Progress</h2>
                    <p>How far with registration process?</p>
                    <ul className="steps">
                      <li
                        className={`step ${
                          registration.phone_verified && "step-success"
                        }`}
                      >
                        Phone Verified
                      </li>
                      <li
                        className={`step ${
                          registration.email_verified && "step-success"
                        }`}
                      >
                        Email Verified
                      </li>
                      <li
                        className={`step ${
                          registration.passwordSet && "step-success"
                        }`}
                      >
                        Primary Details
                      </li>
                      <li
                        className={`step ${
                          registration.ended && "step-success"
                        }`}
                      >
                        Account Creation
                      </li>
                    </ul>
                    {/* <div className="card-actions">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:p-8 p-2">
              <h1 className="text-2xl text-bold">Complete Registration</h1>
              {registration.phone_verified == false ? (
                <InitRegistartion />
              ) : (
                <div>
                  {registration.email_verified == false ? (
                    <EmailVerify registration={registration} />
                  ) : (
                    <div>
                      <RegisterForm
                        registration={registration}
                        clearRegState={props.clearRegState}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteRegistration;

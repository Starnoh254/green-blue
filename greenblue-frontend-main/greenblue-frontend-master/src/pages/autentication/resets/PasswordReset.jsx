import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { toast } from "react-toastify";
import axios from "axios";
import { isMobile } from "react-device-detect";
import OtpInput from "react-otp-input";
import useURL from "../../../hooks/useURL";

const PasswordReset = (props) => {
  const PhoneInput = PI.default ? PI.default : PI;
  const [phone, setPhone] = useState("");
  const [opt_sent, setOPTSent] = useState(false);
  const [reset_on, setResetOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [symopt, setSymOtp] = useState(null);
  const [code, setCode] = useState("");
  const [count, setCount] = useState(99);
  const [secure, setSecure] = useState(true);
  const [password, setPassword] = useState("");
  const [is_opened, setOpened] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);
  }, [count]);
  const { baseUrl } = useURL();

  const sendOPT = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setSymOtp(otp);
    setLoading(true);
    const data = {
      messages: [
        {
          destinations: [
            {
              to: phone,
            },
          ],
          from: "InfoSMS",
          text: `Your Verification code is ${otp}, please do not share your code`,
        },
      ],
    };
    const config = {
      headers: {
        Authorization: `App bee5607eb45d7e20b5a8ce77193f08c4-b7f660d2-c25a-4eeb-abf0-4ff0e099626b`,
      },
    };

    axios
      .post(`https://6jqv98.api.infobip.com/sms/2/text/advanced`, data, config)
      .then((res) => {
        setCount(99);
        setOPTSent(true);
        setLoading(false);
        toast.success(`OTP successfully sent to ${phone}`, {
          theme: "colored",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const verifyCode = async (value) => {
    setCode(value);
    if (value.length == 6) {
      if (value == symopt) {
        toast.success(
          "Verification complete, proceed and sent a new password",
          {
            theme: "colored",
          }
        );
        setResetOn(true);
      } else {
        toast.error(
          "The code you have entered is invalid, please recheck or send another OTP",
          {
            theme: "colored",
          }
        );
      }
    }
  };
  const phoneChecker = async () => {
    setLoading(true);

    axios
      .post(`${baseUrl}/api/v1/verify/phone`, { phone: phone })
      .then((res) => {
        const registered = !res.data.available;
        if (registered) {
          sendOPT();
        } else {
          setLoading(false);
          toast.error(
            "The number you have entered does not exist on our system",
            {
              theme: "colored",
            }
          );
        }
      });
  };
  const setNewPassword = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer WpJqiLYQbKwk0JZlZKwYPh+x3gtQfwUQlNjmlTuCjaI=`,
      },
    };
    await axios
      .post(
        `${baseUrl}/api/v1/user/password/reset`,
        { phone: phone, password: password },
        config
      )
      .then((res) => {
        toast.success(
          "New Password has been set successfully, please proceed and login",
          {
            theme: "colored",
          }
        );
        setOpened(false);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("New password could not be set because of an issue", {
          theme: "colored",
        });
        setLoading(false);
      });
  };
  return (
    <div>
      <p style={{ fontSize: 14 }}>
        Forgot password{" "}
        <label
          htmlFor="my-modal-3"
          className="btn btn-link p-0"
          style={{ textTransform: "lowercase" }}
          onClick={() => setOpened(true)}
        >
          Reset Password
        </label>
      </p>
      <input
        checked={is_opened}
        type="checkbox"
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal w-p6">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setOpened(false)}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Reset Password</h3>
          {!opt_sent && (
            <div>
              <p className="pt-2 pb-2">Enter your registered phone number</p>
              <PhoneInput
                country={"ke"}
                autoFormat={true}
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => setPhone(val)}
                inputStyle={{
                  width: "100%",
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontWeight: "600",
                }}
              />
              <button
                onClick={() => phoneChecker()}
                className={`mt-5 btn ${loading && "loading"} btn-primary`}
              >
                Reset Password
              </button>
            </div>
          )}
          {opt_sent && (
            <div>
              {reset_on ? (
                <div>
                  <p className="text-md mb-2 mt-2">Enter a new Password</p>
                  <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <i
                        className="fa fa-lock"
                        style={{ fontSize: 23, color: "#a6b7b0" }}
                      ></i>
                    </div>
                    <input
                      type={secure ? "password" : "text"}
                      id="password"
                      autoComplete="off"
                      placeholder="Enter a new Password"
                      className="input input-bordered input-md w-full  block pl-10 w-full text-md"
                      required
                      style={{ fontWeight: "600" }}
                      onChange={() => setPassword(event.target.value)}
                    />

                    <a
                      onClick={() => setSecure(!secure)}
                      style={{ textDecoration: "none" }}
                      className="btn btn-sm btn-link  text-black absolute right-1.5 bottom-2 focus:ring-4 focus:outline-none focus:ring-blue-300  "
                    >
                      {secure ? (
                        <i
                          className="fa fa-eye"
                          style={{ fontSize: 22, color: "#585a65" }}
                        ></i>
                      ) : (
                        <i
                          className="far fa-eye-slash"
                          style={{ fontSize: 22, color: "#585a65" }}
                        ></i>
                      )}
                    </a>
                  </div>
                  <label className="text-sm">
                    Password must be above 4 characters
                  </label>
                  <button
                    onClick={() => setNewPassword()}
                    className={`mt-5 btn ${loading && "loading"} btn-primary`}
                    disabled={password.length >= 4 ? false : true}
                  >
                    Set New Password
                  </button>
                </div>
              ) : (
                <div>
                  <p>
                    An OTP has been sent to <strong>{phone}</strong>, please
                    enter it below to verify your identity. Wrong number?{" "}
                    <a
                      href="#"
                      style={{ color: "#38d39a", fontWeight: "600" }}
                      onClick={() => setOPTSent(false)}
                    >
                      Click to Change
                    </a>
                  </p>

                  <br />
                  <OtpInput
                    value={code}
                    onChange={verifyCode}
                    numInputs={6}
                    renderSeparator={
                      <span style={{ fontWeight: "900", padding: 2 }}>-</span>
                    }
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      borderWidth: 1,
                      padding: isMobile ? 5 : 10,
                      width: isMobile ? 40 : 50,
                      borderRadius: 10,
                      fontSize: 20,
                      fontWeight: "600",
                      color: "#697384",
                    }}
                  />
                  <br />
                  {count > 0 && (
                    <p style={{ fontWeight: "600" }}>
                      OTP not received? Resend in{" "}
                      <span className="countdown" style={{ color: "#38d39a" }}>
                        <span style={{ "--value": count }}></span>
                      </span>{" "}
                      seconds{" "}
                    </p>
                  )}

                  {count == 0 && (
                    <p>
                      Didn't receive OTP?{" "}
                      <a
                        href="#"
                        style={{ color: "#38d39a", fontWeight: "600" }}
                        onClick={() => sendOPT()}
                      >
                        Resend OTP{" "}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;

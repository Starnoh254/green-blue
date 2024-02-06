import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import axios from "axios";
import useURL from "../../hooks/useURL";
const EmailVerify = (props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");
  const [value, setValue] = useState("");
  const [start, setStart] = useState(false);
  const [code, setCode] = useState(null);
  const [count, setCount] = useState(99);
  const [otp, setOpt] = useState("");
  const form = useRef();
  const reg_reducer = props.appState.registerReducer;
  const genCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setCode(code);
  };
  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);
  }, [count]);
  useEffect(() => {
    genCode();
  }, []);
  const { baseUrl } = useURL();
  const sendEmail = async () => {
    setStart(true);
    setLoading(false);
    await axios
      .post(`${baseUrl}/api/v1/email/send/code`, {
        email: email,
        code: code,
      })
      .then((res) => {
        setStart(true);
        setLoading(false);
        toast.success(`Email verification code successfully sent to ${email}`, {
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const verifyCode = async (value) => {
    setOpt(value);
    if (value.length == 6) {
      if (value == code) {
        const data = {
          userExist: reg_reducer.userExist,
          started: true, //WHEN  PROCESS STARTS
          ended: reg_reducer.ended, //UPDATE WHEN IT"S COMPLETE
          phone_verified: reg_reducer.phone_verified, //AFTER AN OPT VEROIFICATION IS DONE
          email_verified: true, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
          first_name: reg_reducer.first_name,
          last_name: reg_reducer.last_name,
          email: email,
          phone: reg_reducer.phone,
          referrered_by: reg_reducer.referrered_by,
          country: reg_reducer.country,
          passwordSet: reg_reducer.passwordSet,
          access_token: reg_reducer.access_token,
        };
        await props.registerState(data);
        toast.success(
          "Your email has been verified successfully, proceed to register an account",
          {
            theme: "colored",
          }
        );
        //UPDATE PHONE STATE REDUX
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
  const emailChecker = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/verify/email`, { email: email })
      .then((res) => {
        const registered = !res.data.available;
        if (registered) {
          toast.error(
            "The email you have entered is already in use by another account. Please use another email",
            {
              theme: "colored",
            }
          );
          setLoading(false);
        } else {
          const data = {
            userExist: reg_reducer.userExist,
            started: true, //WHEN  PROCESS STARTS
            ended: reg_reducer.ended, //UPDATE WHEN IT"S COMPLETE
            phone_verified: reg_reducer.phone_verified, //AFTER AN OPT VEROIFICATION IS DONE
            email_verified: true, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
            first_name: reg_reducer.first_name,
            last_name: reg_reducer.last_name,
            email: email,
            phone: reg_reducer.phone,
            referrered_by: reg_reducer.referrered_by,
            country: reg_reducer.country,
            passwordSet: reg_reducer.passwordSet,
            access_token: reg_reducer.access_token,
          };
          props.registerState(data);
        }
      });
  };
  return (
    <div>
      {start == true ? (
        <div>
          <br />
          <p>
            A verification code has been sent to <strong>{email}</strong>,
            please enter it below to verify your email
          </p>
          {/* <h1>Code : {code}</h1> */}
          <br />
          <OtpInput
            inputType="number"
            value={otp}
            onChange={verifyCode}
            numInputs={6}
            renderSeparator={
              <span style={{ fontWeight: "900", padding: 2 }}>-</span>
            }
            renderInput={(props) => (
              <input
                className="input input-bordered input-md w-full p-8  block pl-10 w-full text-md"
                {...props}
              />
            )}
            inputStyle={{
              borderWidth: 1,
              padding: isMobile ? 5 : 10,
              width: isMobile ? 45 : 50,
              borderRadius: 10,
              fontSize: 20,
              fontWeight: "600",
              color: "#697384",
            }}
          />
          <br />
          {count > 0 && (
            <p style={{ fontWeight: "600" }}>
              Email not received? Resend in{" "}
              <span className="countdown" style={{ color: "#38d39a" }}>
                <span style={{ "--value": count }}></span>
              </span>{" "}
              seconds{" "}
            </p>
          )}
          {count == 0 && (
            <p>
              Didn't receive verification code?{" "}
              <a
                href="#"
                style={{ color: "#38d39a", fontWeight: "600" }}
                onClick={() => sendEmail()}
              >
                Resend Code{" "}
              </a>
            </p>
          )}
        </div>
      ) : (
        <form ref={form} onSubmit={emailChecker}>
          <br />
          <p className="md:text-md text-sm">
            Enter your email to continue with registration
          </p>
          <br />
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <i
                class="fa fa-envelope"
                style={{ fontSize: 23, color: "#a6b7b0" }}
              ></i>
            </div>
            <input
              style={{ display: "none" }}
              type="code"
              name="code"
              value={code}
            />
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              name="user_email"
              autoComplete="off"
              className="input input-bordered input-md w-full  block pl-10 w-full text-md"
              required
              onChange={() => setEmail(event.target.value)}
            />
          </div>
          <br />
          <button
            // onClick={() => verifyCode()}
            type="submit"
            className={`btn  btn-success w-full ${loading && "loading"}`}
            disabled={email.length < 10 ? true : loading}
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    registerState: (data) =>
      dispatch({ type: "ADD_USER_STATES", payload: data }),
  };
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EmailVerify);

import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
const OPTVerify = (props) => {
  let navigate = useNavigate();
  const phone = props.phone;
  const otp = props.otp;
  const [code, setCode] = useState("");
  const [count, setCount] = useState(99);
  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);
  }, [count]);
  const nextPage = async () => {
    if (props.appState.registerReducer.started) {
      return navigate("/complete_registration");
    }
    return null;
  };
  const sendOPT = async () => {
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
        toast.success(`OTP successfully sent to ${phone}`, {
          theme: "colored",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reg_reducer = props.appState.registerReducer;

  const verifyCode = async (value) => {
    setCode(value);
    if (value.length == 6) {
      if (value == otp) {
        const data = {
          userExist: reg_reducer.userExist,
          started: true, //WHEN  PROCESS STARTS
          ended: reg_reducer.ended, //UPDATE WHEN IT"S COMPLETE
          phone_verified: true, //AFTER AN OPT VEROIFICATION IS DONE
          email_verified: reg_reducer.email_verified, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
          first_name: reg_reducer.first_name,
          last_name: reg_reducer.last_name,
          email: reg_reducer.email,
          phone: phone,
          referrered_by: reg_reducer.referrered_by,
          country: reg_reducer.country,
          passwordSet: reg_reducer.passwordSet,
          access_token: reg_reducer.access_token,
        };
        await props.registerState(data);
        nextPage();
        toast.success(
          "Your phone number has been verified successfully, proceed to register an account",
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
  return (
    <div>
      <p>
        An OTP has been sent to <strong>{phone}</strong>, please enter it below
        to verify your number
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
export default connect(mapStateToProps, mapDispatchToProps)(OPTVerify);

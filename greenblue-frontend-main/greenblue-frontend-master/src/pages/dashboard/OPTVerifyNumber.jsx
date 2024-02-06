import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
const OPTVerifyNumber = (props) => {
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
    //SEND VERIFIED STATE
    props.setPhone(phone);
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
        Authorization: `App 7617bc57d64c0cb69215bb1910e39ac0-4ab4c0de-3dc8-4c44-990d-c603ed08d3b3`,
      },
    };
    axios
      .post(`https://3vy5xm.api.infobip.com/sms/2/text/advanced`, data, config)
      .then((res) => {
        setCount(99);
        toast.success(`OPT successfully sent to ${phone}`, {
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
        An OPT has been sent to <strong>{phone}</strong>, please enter it below
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
        renderInput={(props) => (
          <input
            className="input input-bordered input-md w-full p-8  block pl-10 w-full text-md"
            {...props}
          />
        )}
        inputStyle={{
          borderWidth: 1,
          padding: 10,
          width: 50,
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
          Didn't receive OPT?{" "}
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
export default connect(mapStateToProps, mapDispatchToProps)(OPTVerifyNumber);

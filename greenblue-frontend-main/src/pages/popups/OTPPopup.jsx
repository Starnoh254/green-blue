import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import axios from "axios";
import { isMobile } from "react-device-detect";
const OTPPopups = (props) => {
  const phone = props.phone;
  const otp = props.otp;
  const send_otp = props.send_otp;
  const [code, setCode] = useState("");
  const [count, setCount] = useState(99);
  useEffect(() => {
    setTimeout(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);
  }, [count, send_otp]);
  useEffect(() => {
    if (send_otp == true) {
      sendOPT();
    }
  }, [send_otp]);
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
        toast.success(
          `Transaction verification OPT successfully sent to ${phone}`,
          {
            theme: "colored",
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const verifyCode = async (value) => {
    setCode(value);
    if (value.length == 6) {
      if (value == otp) {
        props.verifyStatus(true);
        toast.success("Transaction verified successfully", {
          theme: "colored",
        });
        //UPDATE PHONE STATE REDUX
      } else {
        toast.error("OTP entered is invalid, please confirm the transaction", {
          theme: "colored",
        });
      }
    }
  };
  return (
    <div>
      <p>
        An OTP has been sent to <strong>{phone}</strong>, please enter it below
        to verify your transaction
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
      {props.verify_status == true && (
        <div className="p-4 items-center">{props.nextComp}</div>
      )}
    </div>
  );
};

export default OTPPopups;

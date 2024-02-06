import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import axios from "axios";
import { toast } from "react-toastify";
import OPTVerify from "../autentication/OPTVerify";
import OPTVerifyNumber from "./OPTVerifyNumber";
const VerifyNumber = (props) => {
  const [value, setValue] = useState("");
  const [start, setStart] = useState(false);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const PhoneInput = PI.default ? PI.default : PI;
  const sendOPT = async () => {
    setLoading(true);
    const code = Math.floor(100000 + Math.random() * 900000);
    setCode(code);
    const data = {
      messages: [
        {
          destinations: [
            {
              to: value,
            },
          ],
          from: "InfoSMS",
          text: `Your Verification code is ${code}, please do not share your code`,
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
        toast.success(`OPT successfully sent to ${value}`, {
          theme: "colored",
        });
        setStart(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      {start == true ? (
        <div>
          <p style={{ fontWeight: "600" }}>
            Wrong number?{" "}
            <a
              href="#"
              style={{ color: "#38d39a", fontWeight: "600" }}
              onClick={() => setStart(false)}
            >
              Click to Change
            </a>
          </p>
          <OPTVerifyNumber setPhone={props.setPhone} phone={value} otp={code} />
        </div>
      ) : (
        <div>
          <p style={{ fontWeight: "600" }}>
            Enter your phone number to start registration
          </p>
          <br />
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
            onClick={() => sendOPT()}
            className={`btn btn-lg btn-success w-full ${loading && "loading"}`}
            disabled={value.length < 10 ? true : false}
          >
            Verify Number
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyNumber;

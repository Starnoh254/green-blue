import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import OPTVerify from "./OPTVerify";
import axios from "axios";
import { toast } from "react-toastify";
import useURL from "../../hooks/useURL";
const InitRegistartion = (props) => {
  const [value, setValue] = useState("");
  const [start, setStart] = useState(false);
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const PhoneInput = PI.default ? PI.default : PI;
  const { baseUrl } = useURL();
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
          text: `Your verification code is ${code}, please do not share your code`,
        },
      ],
    };
    const config = {
      headers: {
        Authorization: `App bee5607eb45d7e20b5a8ce77193f08c4-b7f660d2-c25a-4eeb-abf0-4ff0e099626b`,
      },
    };
    setStart(true);
    setLoading(false);
    axios
      .post(`https://6jqv98.api.infobip.com/sms/2/text/advanced`, data, config)
      .then((res) => {
        toast.success(`OTP successfully sent to ${value}`, {
          theme: "colored",
        });
        setStart(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const phoneChecker = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/verify/phone`, { phone: value })
      .then((res) => {
        const registered = !res.data.available;
        if (registered) {
          setLoading(false);

          toast.error(
            "The number is already registered on another account, please login to your account or use another number",
            {
              theme: "colored",
            }
          );
        } else {
          setLoading(false);
          sendOPT();
        }
      });
  };
  return (
    <div>
      {start == true ? (
        <div>
          <p style={{ fontWeight: "600" }}>
            Wrong number?
            <a
              href="#"
              style={{ color: "#38d39a", fontWeight: "600" }}
              onClick={() => setStart(false)}
            >
              Click to Change
            </a>
          </p>
          <OPTVerify phone={value} otp={code} />
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
            inputStyle={{
              width: "100%",
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: "600",
            }}
          />
          <br />
          <button
            onClick={() => phoneChecker()}
            className={`btn  btn-success w-full ${loading && "loading"}`}
            disabled={value.length < 10 ? true : false}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default InitRegistartion;

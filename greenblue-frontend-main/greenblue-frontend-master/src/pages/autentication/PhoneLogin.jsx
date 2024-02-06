import axios from "axios";
import React, { useState, useEffect } from "react";
import PI from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import useURL from "../../hooks/useURL";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PasswordReset from "./resets/PasswordReset";

const PhoneLogin = (props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [ask_password, setAskPassword] = useState(false);
  const [password, setPassword] = useState("");
  const PhoneInput = PI.default ? PI.default : PI;
  const { baseUrl } = useURL();
  const loginUser = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/auth/phone`, {
        phone: value,
        password: password,
      })
      .then((res) => {
        const token = res.headers.get("x-auth-token");
        props.addUser(token);
        setLoading(false);
        toast.success(`Login Successfull!`, {
          theme: "colored",
        });
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
        toast.error(
          `The password does not look familar to us, please confirm and try agian`,
          {
            theme: "colored",
          }
        );
      });
  };
  const phoneChecker = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/verify/phone`, { phone: value })
      .then((res) => {
        const registered = !res.data.available;
        if (registered) {
          setAskPassword(true);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            "The number you have entered does not exist on our system, please register or confirm your number",
            {
              theme: "colored",
            }
          );
        }
      });
  };
  return (
    <div>
      {ask_password == false && (
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
      )}
      {ask_password && (
        <form>
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
              placeholder="Enter Password"
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
        </form>
      )}
      <p style={{ float: "right" }} className="mb-5">
        <PasswordReset />
      </p>
      <br />

      <button
        className={`btn ${loading && "loading"}  btn-success w-full`}
        onClick={() => {
          ask_password ? loginUser() : phoneChecker();
        }}
      >
        {ask_password ? "LOGIN" : "CONTINUE"}
      </button>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (token) => dispatch({ type: "LOGIN_USER", payload: token }),
    logoutUser: (token) => dispatch({ type: "LOGOUT_USER" }),
  };
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin);

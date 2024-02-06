import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import useURL from "../../hooks/useURL";
import { connect } from "react-redux";
import PasswordReset from "./resets/PasswordReset";

const EmailLogin = (props) => {
  const [secure, setSecure] = useState(true);
  const [ask_password, setAskPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useURL();
  const loginUser = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/auth/phone`, {
        phone: email,
        password: password,
      })
      .then((res) => {
        const token = res.headers.get("x-auth-token");
        // console.log(token);
        // props.addUser(token);
        toast.success(`Login Successfull!`, {
          theme: "colored",
        });
        // console.log(res.data);
        props.addUser(token);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(
          `The password does not look familar to us, please confirm and try agian`,
          {
            theme: "colored",
          }
        );
      });
  };
  const emailChecker = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/verify/email`, { email: email })
      .then((res) => {
        const registered = !res.data.available;
        if (registered) {
          setAskPassword(true);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(
            "The email you have entered does not exist on our system, please register or confirm your email address",
            {
              theme: "colored",
            }
          );
        }
      });
  };
  return (
    <div>
      <form>
        {ask_password == false && (
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <i
                class="fa fa-envelope"
                style={{ fontSize: 23, color: "#a6b7b0" }}
              ></i>
            </div>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              autoComplete="off"
              className="input input-bordered input-md w-full block pl-10 w-full text-md"
              required
              style={{ fontWeight: "600" }}
              onChange={() => setEmail(event.target.value)}
            />
          </div>
        )}
        {ask_password && (
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <i
                class="fa fa-lock"
                style={{ fontSize: 23, color: "#a6b7b0" }}
              ></i>
            </div>
            <input
              type={secure ? "password" : "text"}
              id="password"
              placeholder="Enter Password"
              autoComplete="off"
              className="input input-bordered input-md w-full block pl-10 w-full text-md"
              style={{ fontWeight: "600" }}
              required
              onChange={() => setPassword(event.target.value)}
            />

            <a
              onClick={() => setSecure(!secure)}
              style={{ textDecoration: "none" }}
              className="btn btn-sm btn-link  text-black absolute right-2.5 bottom-2 focus:ring-4 focus:outline-none focus:ring-blue-300  "
            >
              {secure ? (
                <i
                  class="fa fa-eye"
                  style={{ fontSize: 22, color: "#585a65" }}
                ></i>
              ) : (
                <i
                  class="far fa-eye-slash"
                  style={{ fontSize: 22, color: "#585a65" }}
                ></i>
              )}
            </a>
          </div>
        )}
      </form>
      <p style={{ float: "right" }} className="mb-5">
        <PasswordReset />
      </p>
      <br />
      <button
        className={`btn ${loading && "loading"}  btn-success w-full`}
        onClick={() => {
          ask_password ? loginUser() : emailChecker();
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
export default connect(mapStateToProps, mapDispatchToProps)(EmailLogin);

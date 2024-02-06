import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import EmailLogin from "./EmailLogin";
import PhoneLogin from "./PhoneLogin";
import SocialMedia from "./SocialMedia";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { isMobile } from "react-device-detect";
const Login = (props) => {
  const [loginMethod, setLoginMethod] = useState("phone");
  const [startLogin, setStartLogin] = useState(false);
  // console.log(props.appState);
  return (
    <div>
      {isMobile ? (
        <div
          className="p-4 bg-white"
          style={{
            width: "100%",
          }}
        >
          <img
            className="place-self-center center"
            style={{ alignSelf: "center", width: 100 }}
            src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.webp"
          />

          <h1 className="text-2xl text-bold">Welcome</h1>
          <p>Login to your account</p>
          <br />

          <div
            className="tabs"
            style={{ width: "100%", fontWeight: "600", fontSize: 12 }}
          >
            <a
              className={`tab tab-lifted ${
                loginMethod == "phone" && "tab-active"
              }`}
              onClick={() => setLoginMethod("phone")}
              style={{ width: "50%", fontWeight: "600" }}
            >
              Phone Number
            </a>
            <a
              className={`tab  tab-lifted ${
                loginMethod != "phone" && "tab-active"
              }`}
              onClick={() => setLoginMethod("email")}
              style={{ width: "50%", fontWeight: "600" }}
            >
              Email Address
            </a>
            {loginMethod == "phone" ? (
              <p className="text-l pt-4 " style={{ fontSize: 15 }}>
                Login Using your phone number and password
              </p>
            ) : (
              <p className="text-l pt-4 " style={{ fontSize: 15 }}>
                Login using your email and password
              </p>
            )}
          </div>
          <br />
          {loginMethod == "phone" ? <PhoneLogin /> : <EmailLogin />}
          <div className="flex flex-col w-full border-opacity-50">
            <div className="divider">OR</div>
          </div>
          <SocialMedia source="login" />
          <p>
            Don't have an account?{" "}
            <Link
              style={{ color: "#38d39a", fontWeight: "600" }}
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </div>
      ) : (
        <div
          className="hero min-h-screen "
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/hzurp2z3v/image/upload/v1681410420/landscape-hills-covered-greenery-surrounded-by-sea-cloudy-sky-during-sunset-min_jolchr.webp)",
            backgroundSize: "cover",
          }}
        >
          <ToastContainer />
          <div className="lg:container mx-auto lg:px-40 p-1">
            <div className="card w-full bg-base-100">
              <div className="card-body md:p-0 p-5">
                <div
                  class="grid lg:grid-cols-2 md:gap-2 "
                  style={{
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    height: "90vh",
                  }}
                >
                  <div
                    className="md:h-full h-0"
                    style={{
                      backgroundImage: isMobile
                        ? ""
                        : "url(https://res.cloudinary.com/hzurp2z3v/image/upload/v1682338358/GREEN_BLUE_FOUNDATION_pfapym.webp)",

                      backgroundSize: "cover",
                      borderTopLeftRadius: 15,
                      borderBottomLeftRadius: 15,
                    }}
                  ></div>
                  {startLogin == true ? (
                    <div
                      className="md:p-12 md:h-full"
                      style={{
                        width: "100%",
                        height: "90vh",
                      }}
                    >
                      <img
                        className="place-self-center center"
                        style={{ alignSelf: "center", width: 100 }}
                        src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.webp"
                      />

                      <h1 className="text-2xl text-bold">Welcome</h1>
                      <p>Login to your account</p>
                      <br />

                      <div
                        className="tabs"
                        style={{
                          width: "100%",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        <a
                          className={`tab tab-lifted ${
                            loginMethod == "phone" && "tab-active"
                          }`}
                          onClick={() => setLoginMethod("phone")}
                          style={{ width: "50%", fontWeight: "600" }}
                        >
                          Phone Number
                        </a>
                        <a
                          className={`tab  tab-lifted ${
                            loginMethod != "phone" && "tab-active"
                          }`}
                          onClick={() => setLoginMethod("email")}
                          style={{ width: "50%", fontWeight: "600" }}
                        >
                          Email Address
                        </a>
                        {loginMethod == "phone" ? (
                          <p
                            className="text-l pt-4 text-sm"
                            style={{ fontSize: 15 }}
                          >
                            Login using your phone number and password
                          </p>
                        ) : (
                          <p
                            className="text-l pt-4 text-sm"
                            style={{ fontSize: 15 }}
                          >
                            Login using your email and password
                          </p>
                        )}
                      </div>
                      <br />
                      {loginMethod == "phone" ? <PhoneLogin /> : <EmailLogin />}
                      <div className="flex flex-col w-full border-opacity-50">
                        <div className="divider">OR</div>
                      </div>
                      <SocialMedia source="login" />
                      <p>
                        Don't have an account?{" "}
                        <Link
                          style={{ color: "#38d39a", fontWeight: "600" }}
                          to="/pre_register"
                        >
                          Register / Open an Account
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="md:p-12 md:h-full"
                        style={{
                          width: "100%",
                          height: "90vh",
                        }}
                      >
                        <img
                          className="place-self-center center"
                          style={{ alignSelf: "center", width: 100 }}
                          src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.webp"
                        />

                        <h1 className="text-2xl text-bold">Welcome to GBFA</h1>
                        <p>Choose action</p>
                        <br />
                        <br />
                        <button
                          className="btn btn-primary w-full"
                          onClick={() => setStartLogin(true)}
                        >
                          Login to your account
                        </button>
                        <br />
                        <br />
                        <Link
                          className="btn btn-secondary w-full"
                          to="/pre_register"
                        >
                          Open an Account
                        </Link>
                        <br />
                        <br />
                        <a
                          className="btn btn-info w-full"
                          href="https://greenblueafrica.com"
                          target="_blank"
                        >
                          Know mnore about GBFA
                        </a>
                        <br />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

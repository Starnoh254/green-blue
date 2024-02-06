import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import SocialMedia from "./SocialMedia";
import { Link } from "react-router-dom";
import InitRegistartion from "./InitRegistration";
import { ToastContainer } from "react-toastify";
import { isMobile } from "react-device-detect";
const Register = (props) => {
  return (
    <div>
      {isMobile ? (
        <div
          className="md:p-12 p-4 bg-white"
          style={{
            width: "100%",
          }}
        >
          <img
            className="place-self-center center"
            style={{ alignSelf: "center", width: 100 }}
            src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.webp"
          />

          <h1 className="text-2xl text-bold" style={{ fontWeight: "900" }}>
            Open an account
          </h1>
          <p>Select your preferred registration method</p>
          <br />
          <InitRegistartion />
          <br />

          <div className="flex flex-col w-full border-opacity-50">
            <div className="divider">OR</div>
          </div>
          <SocialMedia source="register" />
          <p>
            Already have an account?
            <Link style={{ color: "#38d39a", fontWeight: "600" }} to="/">
              Login
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
          <div className="container mx-auto md:px-40 p-1">
            <div className="card w-full bg-base-100 ">
              <div className="card-body md:p-0 p-4">
                <div
                  className="grid md:grid-cols-2 md:gap-2 "
                  style={{
                    borderTopLeftRadius: isMobile ? 0 : 20,
                    borderBottomLeftRadius: isMobile ? 0 : 20,
                    height: "90vh",
                  }}
                >
                  <div
                    className="md:h-full h-0"
                    style={{
                      backgroundImage:
                        "url(https://res.cloudinary.com/hzurp2z3v/image/upload/v1682338358/GREEN_BLUE_FOUNDATION_pfapym.webp)",

                      backgroundSize: "cover",
                      borderTopLeftRadius: 15,
                      borderBottomLeftRadius: 15,
                    }}
                  ></div>
                  <div
                    className="md:p-12 p-2"
                    style={{
                      width: "100%",
                    }}
                  >
                    <img
                      className="place-self-center center"
                      style={{ alignSelf: "center", width: 100 }}
                      src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.webp"
                    />

                    <h1 className="text-2xl text-bold">Open an Account</h1>
                    <p>Select your preferred registration method</p>
                    <br />
                    <InitRegistartion />
                    <br />

                    <div className="flex flex-col w-full border-opacity-50">
                      <div className="divider">OR</div>
                    </div>
                    <SocialMedia source="register" />
                    <p>
                      Already have an account?
                      <Link
                        style={{ color: "#38d39a", fontWeight: "600" }}
                        to="/"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

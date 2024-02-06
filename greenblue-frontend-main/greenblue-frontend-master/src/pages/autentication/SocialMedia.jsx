import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
const SocialMedia = (props) => {
  const { baseUrl } = useURL();
  let navigate = useNavigate();
  const source = props.source;
  const reg_reducer = props.appState.registerReducer;
  const _successRegister = async (data, token) => {
    //UPDATE STATE
    const user = {
      userExist: reg_reducer.userExist,
      started: true, //WHEN  PROCESS STARTS
      ended: reg_reducer.ended, //UPDATE WHEN IT"S COMPLETE
      phone_verified: false, //AFTER AN OPT VEROIFICATION IS DONE
      email_verified: true, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: "",
      referrered_by: reg_reducer.referrered_by,
      country: reg_reducer.country,
      passwordSet: reg_reducer.passwordSet,
      access_token: token,
    };
    await props.registerState(user);
    return navigate("/complete_registration");
  };
  const _successLogin = async (data, token) => {
    await props.addUser(token);
  };
  const facebookResponse = async (response) => {
    await verifyEmail(response.email, response, "facebook");
  };
  const registerFBUser = async (response) => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: response.accessToken }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    fetch(`${baseUrl}/api/v1/auth/facebook`, options).then((r) => {
      const token = r.headers.get("x-auth-token");
      r.json().then((user) => {
        if (token) {
          if (source == "login") {
            _successLogin(user, token);
          } else {
            _successRegister(user, token);
          }
        }
      });
    });
  };
  const fetchUserInfo = async (token) => {
    // console.log(response);
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", config)
      .then((res) => {
        console.log(res);
        const user = res.data;
        verifyEmail(user.email, token, "google");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const verifyEmail = (email, response, strategy) => {
    axios
      .post(`${baseUrl}/api/v1/verify/email`, { email: email })
      .then((res) => {
        if (source == "login") {
          if (res.data.available) {
            toast.error(
              `Account not found, please register or try to login using a different account `,
              {
                theme: "colored",
              }
            );
          } else {
            strategy == "facebook"
              ? registerFBUser(response)
              : googleRes(response);
          }
        } else {
          if (res.data.available == false) {
            toast.error(
              `An error occurred, an account already exist under the connected account, go to login to access your account `,
              {
                theme: "colored",
              }
            );
          } else {
            strategy == "facebook"
              ? registerFBUser(response)
              : googleRes(response);
          }
        }
        return !res.data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      const token = tokenResponse.access_token;
      fetchUserInfo(token);
    },
  });

  const googleRes = async (access_token) => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: access_token }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    fetch(`${baseUrl}/api/v1/auth/google`, options).then((r) => {
      const token = r.headers.get("x-auth-token");
      r.json()
        .then((user) => {
          if (token) {
            //ADD LOGIN GLOBAL STATGE
            if (source == "login") {
              _successLogin(user, token);
            } else {
              _successRegister(user, token);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <div>
      <ToastContainer />

      <div
        style={{ marginTop: 10, marginBottom: 10 }}
        class="grid md:grid-cols-2 md:gap-2 "
      >
        <button
          style={{ fontSize: 13 }}
          className="btn btn-accent"
          onClick={() => login()}
        >
          <i class="fab fa-google"></i>
          {"  "}
          <span style={{ paddingLeft: 4 }}>
            {" "}
            {source == "login" ? "GOOGLE SIGN IN " : "GOOGLE SIGN UP"}
          </span>
        </button>
        {/* <GoogleLogin
          onSuccess={(credentialResponse) => {
            googleResponse(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          size="large"
          width={`100%`}
          style={{ textTranform: "uppercase", padding: 10 }}
          text={source == "login" ? "signin_with" : "signup_with"}
          promptMomentNotification={true}
        /> */}
        {isMobile && <p style={{ padding: 5 }}></p>}
        <FacebookLogin
          appId="1208163609834482"
          textButton={source == "login" ? "Facebook Login" : "Facebook Signup"}
          fields="name,email,picture"
          callback={facebookResponse}
          disableMobileRedirect={true}
          buttonStyle={{
            borderRadius: 0,
            padding: 13,
            fontSize: 12,
            borderRadius: 5,
            width: "100%",
            backgroundColor: "#1470e7",
            borderColor: "#1470e7",
          }}
          icon="fa-facebook"
          containerStyle={{ padding: 0 }}
          // autoLoad={true}
        />
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (token) => dispatch({ type: "LOGIN_USER", payload: token }),
    registerState: (data) =>
      dispatch({ type: "ADD_USER_STATES", payload: data }),
  };
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SocialMedia);

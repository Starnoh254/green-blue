import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useNavigate } from "react-router-dom";
import useGeoLocation from "react-ipgeolocation";

import { getName } from "country-list";
import axios from "axios";
import useURL from "../../hooks/useURL";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
const RegisterForm = (props) => {
  const registration = props.registration;
  const reg_reducer = registration;
  // console.log(reg_reducer);
  let navigate = useNavigate();
  const { baseUrl } = useURL();
  const location = useGeoLocation();
  const [loading, setLoading] = useState(false);
  const [first_name, setFirstName] = useState(registration.first_name);
  const [last_name, setLastName] = useState(registration.last_name);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(registration.email);
  const [country, setCountry] = useState(registration.country);
  const [currency, setCurrency] = useState("");
  const [country_code, setCountryCode] = useState(registration.country);
  const [secure, setSecure] = useState(true);
  const options = useMemo(() => countryList().getData(), []);
  const changeHandler = (country) => {
    console.log(country);
    setCountry(country);
    setCountryCode(country.value);
  };
  useEffect(() => {
    setNewCountry();
  }, [location.country]);
  const setNewCountry = async () => {
    if (location.isLoading == false) {
      const name = await getName(location.country);
      console.log(name);
      setCountry({ label: name, value: location.country });
    }
  };
  const confirmCancel = async () => {
    clearState();
  };
  const loginUser = async () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/auth/phone`, {
        phone: reg_reducer.phone,
        password: password,
      })
      .then((res) => {
        const token = res.headers.get("x-auth-token");
        props.addUser(token);
        setLoading(false);
        props.clearRegState();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const registerUser = async () => {
    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${reg_reducer.access_token}` },
    };
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: reg_reducer.phone,
      password: password,
      country: country,
      referrer: reg_reducer.referrered_by,
      strategy: "custom",
    };
    axios
      .post(`${baseUrl}/api/v1/auth/register`, data, config)
      .then(async (res) => {
        loginUser();
        props.clearRegState();
        // await props.addUser(token);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const updateUser = async () => {
    const config = {
      headers: { Authorization: `Bearer ${reg_reducer.access_token}` },
    };
    setLoading(true);
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: reg_reducer.phone,
      password: password,
      country: country,
      referrer: reg_reducer.referrered_by,
    };
    axios
      .put(`${baseUrl}/api/v1/auth/update`, data, config)
      .then(async (res) => {
        setLoading(false);
        await props.addUser(reg_reducer.access_token);
        props.clearRegState();
        return navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const clearState = async () => {
    props.clearRegState();
    return navigate("/");
  };
  const completeReg = async () => {
    if (reg_reducer.access_token.length >= 10) {
      //UPDATE
      await updateUser();
    } else {
      //REGISTER
      await registerUser();
    }
  };
  return (
    <div>
      <h1 style={{ paddingTop: 5, paddingBottom: 5 }}>
        Please enter missing details to proceed
      </h1>
      <div className="card card-side bg-base-100 bordered">
        {isMobile == false && (
          <figure className="p-2">
            <div className="avatar">
              <div className="w-24 mask mask-squircle bg-green">
                <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680553147/man-character-social-media-network-communication-icons_24908-13036_b5zxcz.jpg" />
              </div>
            </div>
          </figure>
        )}

        <div className="card-body p-2">
          <h2 className="card-title">Referrer ID</h2>
          <p>
            {registration.referrered_by == null ? (
              <div className="alert alert-error md:p-4 p-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="md:text-md text-sm">
                    You need to be referred, please request for a link
                  </span>
                </div>
              </div>
            ) : (
              registration.referrered_by
            )}
          </p>
        </div>
      </div>
      <div class="grid md:grid-cols-2 md:gap-2 ">
        <div>
          <label className="label">
            <span className="label-text text-bold">First Name</span>
          </label>
          <input
            type="text"
            id="first_name"
            value={first_name}
            placeholder="Enter First Name"
            autoComplete="off"
            className="input input-bordered input-md w-full p-4  block  w-full text-md"
            onChange={() => setFirstName(event.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text text-bold">Last Name</span>
          </label>
          <input
            type="text"
            id="last_name"
            placeholder="Enter Last Name"
            value={last_name}
            autoComplete="off"
            className="input input-bordered input-md w-full p-4  block w-full text-md"
            required
            onChange={() => setLastName(event.target.value)}
          />
        </div>
      </div>
      <div class="grid md:grid-cols-1 md:gap-1 ">
        <div>
          <label className="label">
            <span className="label-text text-bold">Country</span>
          </label>
          <Select
            styles={{ padding: 10 }}
            options={options}
            value={country}
            onChange={changeHandler}
            placeholder="Select Country"
            autoFocus={false}
          />
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-bold">Phone Number</span>
            <span className="label-text-alt">
              <div className="badge badge-success">Verified</div>
            </span>
          </label>
          <input
            type="text"
            id="phone"
            disabled={true}
            value={registration.phone}
            autoComplete="off"
            className="input input-bordered input-md w-full p-4  block w-full text-md"
          />
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text text-bold">Email Address</span>
            <span className="label-text-alt">
              <div className="badge badge-success">Verified</div>
            </span>
          </label>
          <input
            type="text"
            id="phone"
            disabled={true}
            value={registration.email}
            autoComplete="off"
            className="input input-bordered input-md w-full p-4  block w-full text-md"
          />
        </div>
        <label className="label">
          <span className="label-text text-bold">Secure Password</span>
        </label>
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
            className="input input-bordered input-md w-full p-4  block pl-10 w-full text-md"
            required
            onChange={() => setPassword(event.target.value)}
          />

          <a
            onClick={() => setSecure(!secure)}
            style={{ textDecoration: "none" }}
            className="btn btn-sm btn-link  text-black absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300  "
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
        <label className="label">
          <span className="label-text">
            Password should contain 4 or more characters
          </span>
        </label>
        <div class="grid grid-cols-2 gap-2 gap-2">
          <button
            className={`btn md:btn-lg btn-success ${
              loading && "loading"
            } w-full`}
            onClick={() => completeReg()}
            disabled={
              password.length < 4
                ? true
                : reg_reducer.referrered_by == null
                ? true
                : false
            }
          >
            Open Account
          </button>
          <label htmlFor="my-modal" className="btn md:btn-lg ">
            Cancel
          </label>
          <input type="checkbox" id="my-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Are you sure</h3>
              <p className="py-4">
                Are you sure that you want to abort the registration process?
              </p>
              <div className="modal-action">
                <label
                  className="btn btn-error"
                  onClick={() => confirmCancel()}
                >
                  Abort Process
                </label>
                <label htmlFor="my-modal" className="btn">
                  Continue{" "}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);

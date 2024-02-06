import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import { toast } from "react-toastify";
import OTPPopups from "../popups/OTPPopup";
import { isMobile } from "react-device-detect";

const TransferForm = (props) => {
  const [transfer_to, setTransferTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [is_found, setIsFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [send_otp, setSendOPT] = useState(false);
  const [is_opened, setOpened] = useState(false);
  const [otp, setOTP] = useState("");
  const [verify_status, verifyStatus] = useState(false);
  const user = props.user;
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setOTP(code);
  }, []);
  const makeTransfer = async () => {
    setLoading(true);
    setOpened(false);

    const data = {
      to: transfer_to._id,
      amount: amount,
    };
    axios
      .post(`${baseUrl}/api/v1/user/new/transfer`, data, config)
      .then((res) => {
        props.initFunc();
        toast.success(
          `Your transfer of ${amount} USD to ${transfer_to.first_name} was successfull`,
          {
            theme: "colored",
          }
        );
        setAmount(0);
        setTransferTo(null);
        setIsFound(null);
        setLoading(false);
      });
  };
  const searchAccount = async (term) => {
    const search = term.toUpperCase();
    axios
      .get(`${baseUrl}/api/v1/user/search?search=${search}`, config)
      .then((res) => {
        setTransferTo(res.data[0]);
        // console.log(res.data);
        if (res.data.length == 0) {
          setIsFound(false);

          //ERROR
        } else {
          setIsFound(true);
          //  setTransferTo(res.data);
        }
      });
  };
  const handleChange = (value) => {
    if (value.length == 9) {
      searchAccount(value);
    } else {
      //INVALID CODE
      if (value.length == 10) {
        toast.error(
          `Invalid account number, please check and verify the validity of the account number`,
          {
            theme: "colored",
          }
        );
      }
      setIsFound(null);
    }
  };
  return (
    <div className="card w-full bg-base-100 shadow">
      <div className="card-body md:p-6 p-2">
        <div className="md:flex w-full">
          <div className="grid card w-full bg-base-100">
            <div className="card-body md:p-6 p-1">
              {is_found == true && (
                <div className="alert alert-success shadow-lg">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Account number found beloging to{" "}
                      {transfer_to != null && transfer_to.first_name}
                    </span>
                  </div>
                </div>
              )}
              {is_found == false && (
                <div className="alert alert-error shadow-lg">
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
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>The account number was not found</span>
                  </div>
                </div>
              )}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Enter Account Number</span>
                  <span className="label-text-alt">
                    Your bal: {user.account_balance} USD
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Member Acc No"
                  className="input input-bordered w-full"
                  disabled={transfer_to == null ? false : true}
                  onChange={() => handleChange(event.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt"></span>
                </label>
              </div>
              {transfer_to != null && (
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Enter Amount to Transfer</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="input input-bordered w-full"
                    onChange={() => setAmount(event.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt text-secondary">
                      Amount must not exeeced your balance of{" "}
                      {user.account_balance} USD{" "}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="divider md:divider-horizontal">
            <i style={{ fontSize: 30 }} class="fas fa-exchange-alt "></i>
          </div>
          <div className="grid card w-full bg-base-100">
            <div className="card-body md:p-6 p-1 items-center">
              {transfer_to == null ? (
                <div className="card w-full bg-base-100">
                  <figure>
                    <div className="avatar p-2">
                      <div className="w-16 mask mask-squircle ">
                        <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
                      </div>
                    </div>
                  </figure>

                  <ThreeDots
                    height="100"
                    width="100"
                    radius="5"
                    color="#e4e5e7"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{
                      marginLeft: isMobile ? "30%" : "40%",
                    }}
                    wrapperClassName="items-center"
                    visible={true}
                  />
                </div>
              ) : (
                <div className="card w-full bg-base-100">
                  <figure>
                    <div className="avatar p-2">
                      <div className="w-16 mask mask-squircle ">
                        <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center">
                    <h2 className="card-title">
                      {transfer_to.first_name} {transfer_to.last_name}
                    </h2>
                    <p>
                      <strong>Amount to Transfer</strong>
                    </p>
                    <h1>{amount} USD</h1>
                  </div>
                  {verify_status == true ? (
                    <button
                      disabled={amount > user.account_balance ? true : loading}
                      className={`btn md:btn-lg btn-success ${
                        loading && "loading"
                      }`}
                      onClick={
                        amount > 0
                          ? () => makeTransfer()
                          : () => {
                              toast.error(`Please enter an amount`, {
                                theme: "colored",
                              });
                            }
                      }
                    >
                      Transfer Funds
                    </button>
                  ) : (
                    <label
                      className={`btn  md:btn-lg  ${
                        loading && "loading"
                      } btn-success`}
                      disabled={amount > user.account_balance ? true : loading}
                      htmlFor="my-modal-3"
                      onClick={() => {
                        setOpened(true);
                        setSendOPT(true);
                      }}
                    >
                      Verify Transfer
                    </label>
                  )}

                  <input
                    checked={is_opened}
                    type="checkbox"
                    id="my-modal-3"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box relative">
                      <label
                        htmlFor="my-modal-3"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                      >
                        ✕
                      </label>
                      <h3 className="text-lg font-bold">Verify Transfer</h3>
                      <OTPPopups
                        verifyStatus={verifyStatus}
                        phone={props.user.phone}
                        send_otp={send_otp}
                        otp={otp}
                        verify_status={verify_status}
                        nextComp={
                          <button
                            disabled={
                              amount > user.account_balance ? true : loading
                            }
                            className={`btn btn-lg btn-success ${
                              loading && "loading"
                            }`}
                            onClick={
                              amount > 0
                                ? () => makeTransfer()
                                : () => {
                                    toast.error(`Please enter an amount`, {
                                      theme: "colored",
                                    });
                                  }
                            }
                          >
                            Transfer Funds
                          </button>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;

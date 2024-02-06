import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import useURL from "../../hooks/useURL";

const UpdateBalance = (props) => {
  const [amount, setAmount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useURL();
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  console.log(props);
  const updateAccount = async () => {
    setLoading(true);
    await axios
      .post(`${baseUrl}/api/v1/user/balance`, { balance: amount }, config)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setChecked(false);
        props.initFun();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <div>
      <label
        htmlFor="my-modal-3"
        onClick={() => setChecked(true)}
        className="btn md:btn-sm btn-xs btn-accent md:text-md text-xs"
      >
        Update Balance
      </label>
      <input
        checked={checked}
        type="checkbox"
        id="my-modal-3"
        className="modal-toggle"
      />
      <div className="modal w-p6 ">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-3"
            onClick={() => setChecked(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg  font-bold">Update Account Balance</h3>
          <br />
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Amount in USD</span>
            </label>
            <input
              type="number"
              placeholder="Account Balance"
              onChange={() => setAmount(event.target.value)}
              className="input input-bordered w-full "
            />
            <br />
            <button
              onClick={() => updateAccount()}
              className={`btn btn-primary ${loading && "loading"}`}
            >
              Save Balance
            </button>
          </div>
          <div className="mt-5"></div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(UpdateBalance);

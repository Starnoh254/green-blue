import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import { connect } from "react-redux";
import axios from "axios";
const UseBalance = (props) => {
  const pack = props.pack;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { baseUrl } = useURL();
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  useEffect(() => {
    getUserBalance();
  }, []);
  const getUserBalance = async () => {
    axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      // console.log(res.data);
      setBalance(res.data.account_balance);
    });
  };
  const purchasePackage = async () => {
    setLoading(true);
    const data = {
      payment_id: props.payment._id,
    };
    axios
      .post(`${baseUrl}/api/v1/purchase/balance`, data, config)
      .then((res) => {
        console.log(res.data);
        //SET STEP
        //SET STEP 4,
        //REFRESH PAYMENTS
        try {
          props.setStep(4);
          props.getPayments();
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div className="grid md:grid-cols-2 md:gap-2 ">
      <div>
        <div className="stats bg-default text-primary-content">
          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value">${balance}</div>
            <div className="stat-actions">
              {/* <button className="btn btn-sm btn-success">Add funds</button> */}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">To Pay</div>
            <div className="stat-value">${props.payment.amount}</div>
            <div className="stat-actions">
              <button
                disabled={props.payment.amount > balance}
                className={`btn btn-sm btn-success ${loading && "loading"}`}
                onClick={() => purchasePackage()}
              >
                Pay Package
              </button>
            </div>
          </div>
        </div>
        <p>
          NB: By clicking pay package, ${pack.amount} amount will be deducted
          from your account balance.
        </p>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(UseBalance);

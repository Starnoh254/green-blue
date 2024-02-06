import React, { useState, useEffect } from "react";
import WithdrawForm from "./WithdrawForm";
import WithdrawalsList from "./WithdrawalsList";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
const Withdraw = (props) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  return (
    <div>
      <WithdrawalsList withdrawals={withdrawals} />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(Withdraw);

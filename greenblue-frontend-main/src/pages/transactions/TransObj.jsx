import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
import useURL from "../../hooks/useURL";
import axios from "axios";

const TransObj = (props) => {
  const [txn, setTxn] = useState(null);
  const transaction = props.transaction;
  const index = props.index;
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getTransDetails();
  }, []);
  const getTransDetails = async () => {
    axios
      .get(`${baseUrl}/api/v1/transaction?id=${transaction._id}`, config)
      .then((res) => {
        // console.log(res.data);
        setTxn(res.data);
      });
  };

  return (
    <>
      {txn !== null && (
        <tr>
          <th>{index + 1}</th>
          <td>{dateFormat(transaction.createdAt, "mmmm dS, yyyy, h:MM")}</td>
          <td>{txn.desc ? txn.desc : transaction.data_model}</td>
          <td>
            {transaction.data_model == "commission" ? (
              <span style={{ color: "green" }}>${txn.amount}</span>
            ) : (
              <>
                {transaction.data_model == "withdrawal" ? (
                  <span style={{ color: "red" }}>-${txn.usd_amount}</span>
                ) : (
                  <>
                    {transaction.effect == "positive" ? (
                      <span style={{ color: "green" }}>${txn.amount}</span>
                    ) : (
                      <span style={{ color: "red" }}>-${txn.amount}</span>
                    )}
                  </>
                )}
              </>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default TransObj;

import React, { useState, useEffect } from "react";
import TransObj from "./TransObj";
const TransactionsList = (props) => {
  const transactions = props.transactions;
  return (
    <div className="overflow-x-auto mt-5">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            return (
              <TransObj
                appState={props.appState}
                key={index}
                index={index}
                transaction={transaction}
              />
            );
          })}
        </tbody>
        {transactions.length == 0 && (
          <div className="items-center">
            <h1
              className="text-bold items-center p-10"
              style={{ textAlign: "center" }}
            >
              NO TRANSACTIONS FOUND
            </h1>
          </div>
        )}
      </table>
    </div>
  );
};

export default TransactionsList;

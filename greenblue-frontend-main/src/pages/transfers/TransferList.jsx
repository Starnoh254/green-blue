import React, { useState, useEffect } from "react";
import TransferDetails from "./TransferDetails";
const TransferList = (props) => {
  const transfers = props.transfers;
  const user = props.user;

  return (
    <div className="overflow-x-auto bg-white">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Date</th>
            <th>Send/Received Form</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer, index) => {
            return (
              <TransferDetails
                key={index}
                appState={props.appState}
                user={user}
                transfer={transfer}
                index={index}
              />
            );
          })}
        </tbody>
      </table>
      {transfers.length == 0 && (
        <div className="items-center">
          <h1 className="text-bold p-10 text-2xl">NO TRANSFER RECORDS FOUND</h1>
        </div>
      )}
    </div>
  );
};

export default TransferList;

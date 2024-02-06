import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
import moment from "moment";

const WithdrawalsList = (props) => {
  const withdrawals = props.withdrawals;

  return (
    <div className="card w-full bg-base-100 shadow mt-6">
      <div className="card-body p-0">
        <h2 className="card-title p-4">Withdrawal Records</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal, index) => {
                const timeago = moment(withdrawal.createdAt).fromNow();

                return (
                  <tr
                    className={`${
                      timeago == "a few seconds ago" && "bg-primary"
                    }`}
                  >
                    <th>
                      {index + 1}
                      {timeago == "a few seconds ago" && (
                        <div className="badge badge-success">New</div>
                      )}
                    </th>
                    <td>
                      {dateFormat(withdrawal.createdAt, "mmmm dS, yyyy, h:MM")}
                    </td>
                    <td>{withdrawal.payout_method}</td>
                    <td>USD {withdrawal.usd_amount}</td>
                    <td>
                      <div
                        className={`badge ${
                          withdrawal.status_obj.is_completed && "badge-success"
                        }`}
                      >
                        {withdrawal.status_obj.status}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {withdrawals.length == 0 && (
            <div className="items-center" style={{ textAlign: "center" }}>
              <h1
                style={{
                  textTransform: "uppercase",
                  textAlign: "center",
                  padding: 10,
                }}
              >
                No Withdrawal done yet
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsList;

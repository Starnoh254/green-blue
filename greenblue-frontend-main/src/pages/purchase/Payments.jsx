import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";

const Payments = (props) => {
  const [loading, setLoading] = useState(false);
  const payments = props.payments;
  const continuePay = (payment, pack) => {
    setLoading(true);
    props.setPayment(payment);
    props.setChoosenMethod(payment.gateway_id);
    props.setPack(pack[0]);
    props.setStep(3);
    setLoading(false);
  };
  return (
    <div className="card w-full bg-base-100 shadow mt-6">
      <div className="card-body p-0">
        <h2 className="card-title p-4">My Purchase Records</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Amount</th>
                <th>Package</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                const pack = props.packs.filter(
                  (pac) => pac._id == payment.package_id
                );
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      {dateFormat(payment.createdAt, "mmmm dS, yyyy, h:MM")}
                    </td>
                    <td>$ {payment.amount}</td>
                    <td>{pack[0].title}</td>
                    <td>{payment.method}</td>
                    <td>
                      {payment.is_completed ? (
                        <div className="badge badge-success">Completed</div>
                      ) : (
                        <div>
                          <button
                            onClick={() => continuePay(payment, pack)}
                            className={`btn btn-sm btn-warning ${
                              loading && "loading"
                            }`}
                          >
                            Continue
                          </button>
                          <p>{payment.status}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {payments.length == 0 && (
            <h1 className="text-bold text-l p-10 text-center">
              NO RECORDS FOUND
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;

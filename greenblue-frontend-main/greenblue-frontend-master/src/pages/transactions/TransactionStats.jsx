import React, { useState, useEffect } from "react";
const TransactionsStats = (props) => {
  const stats = props.stats;
  // console.log(stats);
  const commissions =
    stats.commissions.length == 0
      ? 0
      : stats.commissions.reduce((a, b) => Number(a.sum) + Number(b.sum));
  const withdrawals =
    stats.withdrawals.length == 0
      ? 0
      : stats.withdrawals.reduce((a, b) => {
          return (
            Number(a.sum == undefined ? 0 : a.sum) +
            Number(b.sum == undefined ? 0 : b.sum)
          );
        }, 0);

  console.log(commissions);
  console.log(withdrawals);
  return (
    <div className="stats w-full stats-horizontal shadow">
      <div className="stat text-primary">
        <div className="stat-title">Money In</div>
        <div className="stat-value md:text-4xl text-2xl">${commissions}</div>
        {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
      </div>

      <div className="stat text-accent">
        <div className="stat-title">Money Out</div>
        <div className="stat-value md:text-4xl text-2xl">${withdrawals}</div>
        {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
      </div>

      <div className="stat">
        <div className="stat-title">Total</div>
        <div className="stat-value md:text-4xl text-2xl">
          ${commissions + withdrawals}{" "}
        </div>
        {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
      </div>
    </div>
  );
};

export default TransactionsStats;

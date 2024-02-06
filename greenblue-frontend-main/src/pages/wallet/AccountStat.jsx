import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
const AccountStat = (props) => {
  const stats = props.stats;
  // console.log(stats);
  return (
    <div className="">
      <div className="stats shadow w-full bg-success text-primary-content">
        <div className="stat ">
          <div className="stat-title">Current balance</div>
          <div className="stat-value">${stats.account_balance}</div>
          <div className="stat-desc">This balance is withdrawable</div>
        </div>
      </div>

      <div className="stats shadow w-full mt-4">
        <div className="stat">
          {!isMobile && (
            <div className="stat-figure text-success">
              <i class="fas fa-hand-holding-usd" style={{ fontSize: 25 }}></i>
            </div>
          )}

          <div className="stat-title">Completed</div>
          <div className="stat-value">${stats.completed}</div>
          <div className="stat-desc">Completed Withdrawals</div>
        </div>

        <div className="stat">
          {!isMobile && (
            <div className="stat-figure text-success">
              <i class="fas fa-money-check-alt" style={{ fontSize: 25 }}></i>
            </div>
          )}

          <div className="stat-title md:text-">Pending </div>
          <div className="stat-value">${stats.processing}</div>
          <div className="stat-desc">Waiting Processing</div>
        </div>
      </div>
    </div>
  );
};

export default AccountStat;

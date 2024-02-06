import React, { useState, useEffect } from "react";
import DonutChart from "./DonutChart";
import { AreaChart } from "recharts";
import AreaChartComp from "./AreaChartComp";
import ReferralLink from "./ReferralLink";
import { Link } from "react-router-dom";
const ReferralInfo = (props) => {
  const stats = props.stats;
  return (
    <div className="grid md:grid-cols-2 md:gap-2 md:p-4 p-2">
      <div className="card w-full bg-base-100 shadow">
        <div className="card-body p-4 ">
          <h2 className="card-title">Referral Info</h2>
          <ReferralLink user={props.user} />
          <div className="stats bordered stats-horizontal">
            <div className="stat text-primary">
              <div className="stat-title">Active</div>
              <div className="stat-value ">{stats.active_referrals}</div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>
            <div className="stat">
              <div className="stat-title">In Active</div>
              <div className="stat-value">{stats.inactive_referrals}</div>
              {/* <div className="stat-desc"></div> */}
            </div>
            <div className="stat text-secondary">
              <div className="stat-title">All Referrals</div>
              <div className="stat-value">{stats.referrals}</div>
              {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
            </div>
          </div>
          <div className="grid md:grid-cols-2 md:gap-2 ">
            <div>
              <DonutChart stats={props.stats} />
            </div>
            <div className="card-actions justify-end">
              <Link className="btn btn-sm btn-success" to="/referrals">
                View Referrals
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-full bg-base-100 shadow md:mt-0 mt-2">
        <div className="card-body md:p-4 p-1">
          <div className="p-2">
            <h2 className="card-title">Daily Profit Progress</h2>
            <p>Indicates a comparison of your profit on a daily basis</p>
          </div>
          <AreaChartComp commission_by_date={stats.commission_by_date} />
          <div className="card-actions justify-end">
            {/* <button className="btn btn-primary">Buy Now</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralInfo;

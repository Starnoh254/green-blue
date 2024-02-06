import React, { useState, useEffect } from "react";
const SupportStats = (props) => {
  return (
    <div>
      <div className="stats w-full stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">New Tickets</div>
          <div className="stat-value">0</div>
          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Open Tickets</div>
          <div className="stat-value">0</div>
          {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Closed Tickets</div>
          <div className="stat-value">0</div>
          {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
        </div>
      </div>
    </div>
  );
};

export default SupportStats;

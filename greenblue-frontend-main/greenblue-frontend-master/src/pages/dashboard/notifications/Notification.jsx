import React, { useState, useEffect } from "react";
const Notification = (props) => {
  return (
    <div>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <div className="indicator">
            <i style={{ fontSize: 20 }} class="fas fa-bell"></i>
            <span className="badge badge-sm indicator-item">0</span>
          </div>
        </label>
        <div
          tabIndex={0}
          className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
        >
          <div className="card-body">
            <span className="font-bold text-lg">0 Notifications</span>
            <span className="text">
              <p>No Notifications at this time</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;

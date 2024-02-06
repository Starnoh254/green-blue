import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Sidebar = (props) => {
  return (
    <ul class="menu  p-4 overflow-y-auto w-70 " style={{ borderRadius: 0 }}>
      <li>
        <Link to="/" style={{ fontWeight: "600" }}>
          <i class="fas fa-tachometer-alt  sidebar-icons"></i>
          <span className="pl-1">Dashboard</span>
        </Link>
      </li>

      <li>
        <Link to="/e-wallet" style={{ fontWeight: "600" }}>
          <i class="fas fa-wallet  sidebar-icons"></i>
          <span className="pl-1">E-Wallet</span>
        </Link>
      </li>
      <li>
        <Link to="/purchase" style={{ fontWeight: "600" }}>
          <i class="fas fa-money-check-alt  sidebar-icons"></i>
          <span className="pl-1">Purchase Package</span>
        </Link>
      </li>
      <li>
        <Link to="/transfer" style={{ fontWeight: "600" }}>
          <i class="fas fa-exchange-alt  sidebar-icons"></i>
          <span className="pl-1">Funds Transfer</span>
        </Link>
      </li>
      <li>
        <Link to="/genealogy" style={{ fontWeight: "600" }}>
          <i class="fas fa-network-wired  sidebar-icons"></i>
          <span className="pl-1">Genealogy Tree</span>
        </Link>
      </li>
      <li>
        <Link to="/referrals" style={{ fontWeight: "600" }}>
          <i class="fas fa-users  sidebar-icons"></i>
          <span className="pl-1">Referral Members</span>
        </Link>
      </li>
      {/* <li>
        <Link to="/support" style={{ fontWeight: "600" }}>
          <i class="fas fa-headset shadow sidebar-icons"></i>Support
        </Link>
      </li> */}
      <li>
        <Link to="/transactions" style={{ fontWeight: "600" }}>
          <i class="fas fa-history  sidebar-icons"></i>
          <span className="pl-1">Transactions History</span>
        </Link>
      </li>
      <li>
        <Link to="/profile" style={{ fontWeight: "600" }}>
          <i class="fas fa-user-alt  sidebar-icons"></i>
          <span className="pl-1">Profile</span>
        </Link>
      </li>
      <li>
        <Link to="/settings" style={{ fontWeight: "600" }}>
          <i class="fas fa-user-cog  sidebar-icons"></i>
          <span className="pl-1">Account Settings</span>
        </Link>
      </li>
      <li>
        <a style={{ fontWeight: "600" }} onClick={() => props.logoutUser()}>
          <i class="fas fa-sign-out-alt  sidebar-icons"></i>
          <span className="pl-1">Log Out</span>
        </a>
      </li>
    </ul>
  );
};

export default Sidebar;

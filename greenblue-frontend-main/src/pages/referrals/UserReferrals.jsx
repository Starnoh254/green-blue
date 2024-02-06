import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import axios from "axios";
import ReferralStats from "./ReferralsStats";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import ReferralsList from "./ReferralsList";
import { isMobile } from "react-device-detect";
const UserReferrals = (props) => {
  const token = props.appState.loginReducer.token;
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    await axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      getGenerations(res.data._id);
    });
  };
  const getGenerations = async (id) => {
    axios
      .get(`${baseUrl}/api/v1/user_generations?user_id=${id}`, config)
      .then((res) => {
        // console.log(res.data.tree[0].children);
        setGenerations(res.data.tree[0].children);
        setLoading(false);
      });
  };
  return (
    <div>
      <div>
        <Topbar />
        <div class=" shadow bg-base-200 drawer drawer-mobile">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div class="flex flex-col drawer-content">
            <div
              class="hidden lg:block "
              style={{
                backgroundColor: "#f6f7f8",
                width: "100%",
                height: "100vh",
                padding: 10,
              }}
            >
              <div style={{ padding: 10 }}>
                <h1 className="text-bold text-2xl p-2">My Referral Members</h1>
                <ReferralStats
                  generations={generations}
                  level={level}
                  setLevel={setLevel}
                />

                <ReferralsList generations={generations} level={level} />
              </div>
            </div>
            <div class="text-xs lg:hidden p-2">
              <ReferralStats
                generations={generations}
                level={level}
                setLevel={setLevel}
              />

              <ReferralsList generations={generations} level={level} />
            </div>
          </div>
          <div className="drawer-side" style={{ backgroundColor: "#f6f7f8" }}>
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            {isMobile ? (
              <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                <Sidebar logoutUser={props.logoutUser} />
              </ul>
            ) : (
              <Sidebar logoutUser={props.logoutUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(UserReferrals);

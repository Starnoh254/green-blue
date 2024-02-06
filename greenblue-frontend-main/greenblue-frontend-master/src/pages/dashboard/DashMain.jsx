import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import AddFunds from "../popups/AddFunds";
import UpdateBalance from "./UpdateBalance";

const DashMain = (props) => {
  const [current_package, setCurrent] = useState({});
  const [next_package, setNext] = useState({});
  const stats = props.stats;
  const packages = props.packages;
  useEffect(() => {
    getCurentPackage();
  }, [packages]);
  const getCurentPackage = async () => {
    const user_packages = packages != null ? packages.user_packages : [];
    const packs = packages.packages;
    var current_package = [];
    var next_package = [];
    var next_index = 0;
    await packs.map((pack, index) => {
      const thisPack = user_packages.filter(
        (user_pack) => user_pack.package_id == pack._id
      );
      if (thisPack.length > 0) {
        current_package = pack;
        next_index = index <= 3 ? index + 1 : index;
        //SET NEXT PACKAGE
      }
    });
    next_package = packs[next_index];
    setCurrent(current_package);
    setNext(next_package);
    // console.log(current_package);
    // console.log(next_package);
  };
  return (
    <div style={{ padding: isMobile ? 5 : 20 }}>
      <div className="stats shadow w-full">
        <div className="stat bg-[#82a656] text-white md:p-4 p-2">
          {!isMobile && (
            <div className="md:stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
          )}

          <div className="stat-title text-white">Green Bonus</div>
          <div className="stat-value  text-white text-2xl md:text-4xl">
            ${Number(stats.green_bonus).toFixed(1)}
          </div>
          <div className="stat-desc text-white hidden lg:block">
            Earnings from green bonus
          </div>
        </div>

        <div className="stat bg-[#2c4c62]  md:p-4 p-2">
          {!isMobile && (
            <div className="stat-figure text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
          )}

          <div className="stat-title text-white"> Blue Bonus</div>
          <div className="stat-value text-white text-2xl md:text-4xl">
            ${Number(stats.blue_bonus).toFixed(1)}
          </div>
          <div className="stat-desc text-white hidden lg:block">
            Earnings from blue bonus
          </div>
        </div>

        <div className="stat  md:p-4 p-2">
          <div className="stat-figure text-secondary">
            <div className="avatar">
              <div className="w-16 ">
                <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1684874031/forest_o5obu0.png" />
              </div>
            </div>
          </div>
          <div className="stat-value text-2xl md:text-4xl">{props.trees}</div>
          <div className="stat-title">Trees Grown</div>
          <div className="stat-desc text-secondary hidden lg:block">
            Trees you have grown
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="grid md:grid-cols-2 md:gap-2 ">
        <div className="stats shadow bg-[#82a656]">
          <div className="stat">
            <div className="stat-title ">Account balance</div>
            <div className="stat-value  text-white text-2xl md:text-3xl">
              ${Number(stats.account_balance).toFixed(1)}
            </div>
            {/* <UpdateBalance initFun={props.initFun} /> */}
            <div className="stat-actions">
              <div className="grid md:grid-cols-2 ">
                <a>
                  <Link
                    className="btn md:btn-sm btn-xs md:text-md text-xs btn-warning md:mb-0 mb-1"
                    to="/e-wallet"
                  >
                    Withdraw
                  </Link>
                </a>
                <a>
                  <AddFunds getUser={props.initFun} />
                </a>
              </div>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">All Time Earnings</div>
            <div className="stat-value  text-white text-2xl md:text-3xl">
              ${Number(stats.earnings).toFixed(1)}
            </div>
            <div className="stat-actions">
              <Link className="btn btn-sm" to="/transactions">
                View History
              </Link>
              {/* <button className="btn btn-sm">deposit</button> */}
            </div>
          </div>
        </div>
        {packages != null ? (
          <div className="stats shadow bg-default text-default-content mt-4">
            <div className="stat">
              <div className="stat-title">Current Package</div>
              <div className="stat-value text-xl md:text-3xl">
                {current_package.title}
              </div>
              <div className="stat-actions">
                <Link className="btn btn-sm  btn-success" to="/purchase">
                  Upgrade
                </Link>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Next Package</div>
              <div className="stat-value text-xl md:text-3xl">
                {next_package.title}
              </div>
              {/* <progress
                className="progress progress-warning w-full"
                value="70"
                max="100"
              >
                70%
              </progress> */}

              <div className="stat-actions">
                <div className="stat-desc">
                  Upgrade at {next_package.amount} USD
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="stats shadow bg-default text-default-content">
            <div className="stat">
              <div className="stat-title">Current Package</div>
              <div className="stat-value">
                <ThreeDots
                  height="50"
                  width="50"
                  radius="9"
                  color="#8d949e"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
              <div className="stat-actions">
                <button className="btn btn-sm btn-success">Upgrade</button>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Next Package</div>
              <div className="stat-value">
                <ThreeDots
                  height="50"
                  width="50"
                  radius="9"
                  color="#8d949e"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
              {/* <progress
                className="progress progress-warning w-full"
                value="70"
                max="100"
              >
                70%
              </progress> */}

              <div className="stat-actions">
                <div className="stat-desc">Upgrade to the next package</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <br />
    </div>
  );
};

export default DashMain;

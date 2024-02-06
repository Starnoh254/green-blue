import React, { useState, useEffect } from "react";
const ReferralStats = (props) => {
  const referrals = props.generations;
  const current_level = props.level;
  const viewLevel = async (level) => {
    props.setLevel(level);
  };
  return (
    <div>
      <div className="stats w-full stats-horizontal shadow">
        <div
          className={`stat md:p-4 p-2 ${current_level == 1 && "bg-success"}`}
        >
          <div className="stat-title">Level 1 </div>
          <div className="stat-value md:text-4xl text-xl">
            {
              referrals.filter((referral) => referral.generation_level_id == 1)
                .length
            }
          </div>
          <div className="stat-desc">
            {referrals.filter((referral) => referral.generation_level_id == 1)
              .length >= 1 && (
              <button
                className="btn md:btn-sm btn-xs btn-success w-20"
                onClick={() => viewLevel(1)}
              >
                View
              </button>
            )}
          </div>
        </div>

        <div
          className={`stat md:p-4 p-2 ${current_level == 2 && "bg-success"}`}
        >
          <div className="stat-title">Level 2</div>
          <div className="stat-value md:text-4xl text-xl">
            {
              referrals.filter((referral) => referral.generation_level_id == 2)
                .length
            }
          </div>

          <div className="stat-desc">
            {" "}
            {referrals.filter((referral) => referral.generation_level_id == 2)
              .length >= 1 && (
              <button
                className="btn md:btn-sm btn-xs btn-success w-20"
                onClick={() => viewLevel(2)}
              >
                View
              </button>
            )}
          </div>
        </div>
        <div
          className={`stat md:p-4 p-2 ${current_level == 3 && "bg-success"}`}
        >
          <div className="stat-title">Level 3</div>
          <div className="stat-value md:text-4xl text-xl">
            {
              referrals.filter((referral) => referral.generation_level_id == 3)
                .length
            }
          </div>
          <div className="stat-desc">
            {referrals.filter((referral) => referral.generation_level_id == 3)
              .length >= 1 && (
              <button
                className="btn md:btn-sm btn-xs btn-success w-20"
                onClick={() => viewLevel(3)}
              >
                View
              </button>
            )}
          </div>
        </div>
        <div
          className={`stat md:p-4 p-2 ${current_level == 4 && "bg-success"}`}
        >
          <div className="stat-title ">Level 4</div>
          <div className="stat-value md:text-4xl text-xl">
            {
              referrals.filter((referral) => referral.generation_level_id == 4)
                .length
            }
          </div>
          <div className="stat-desc">
            {referrals.filter((referral) => referral.generation_level_id == 4)
              .length >= 1 && (
              <button
                className="btn md:btn-sm btn-xs btn-success w-20"
                onClick={() => viewLevel(4)}
              >
                View
              </button>
            )}
          </div>
        </div>
        <div
          className={`stat md:p-4 p-2 ${current_level == 5 && "bg-success"}`}
        >
          <div className="stat-title">Level 5</div>
          <div className="stat-value md:text-4xl text-xl">
            {
              referrals.filter((referral) => referral.generation_level_id == 5)
                .length
            }
          </div>
          <div className="stat-desc">
            {referrals.filter((referral) => referral.generation_level_id == 5)
              .length >= 1 && (
              <button
                className="btn md:btn-sm btn-xs btn-success w-20"
                onClick={() => viewLevel(5)}
              >
                View
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralStats;

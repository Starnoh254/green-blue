import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const RegPrompt = (props) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="container mx-auto md:p-10 ">
          <h1 className="text-3xl p-10 text-bold">
            How would you like to join GBFA
          </h1>
          <div className="grid grid-cols-3 gap-2">
            <div className="card w-96 bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img
                  src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1685159235/payment_rervhq.png"
                  alt="Sponsor"
                  className="rounded-xl w-48"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Individual Sponsor</h2>
                <p>
                  Join Green blue foundation as an individaul sponsor, help
                  mitigate climate change by growing trees
                </p>
                <div className="card-actions">
                  <Link className="btn btn-primary" to="/sponsor/individual">
                    Register
                  </Link>{" "}
                </div>
              </div>
            </div>
            <div className="card w-96 bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img
                  src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1685159458/buildings_wvmtgo.png"
                  alt="Sponsor"
                  className="rounded-xl w-48"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Corporate Sponsor</h2>
                <p>
                  Join Green blue foundation as a corporate sponsor, help
                  mitigate climate change by growing trees
                </p>
                <div className="card-actions">
                  <Link className="btn btn-primary" to="/sponsor/organization">
                    Register
                  </Link>{" "}
                </div>
              </div>
            </div>
            <div className="card w-96 bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <img
                  src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1685159309/earning_1_dfkqwl.png"
                  alt="Grow as you earn"
                  className="rounded-xl w-48"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Grow Trees as you Earn</h2>
                <p>
                  Grow trees as you make money from our memebrship empowerment
                  programe
                </p>
                <div className="card-actions">
                  <Link className="btn btn-primary" to="/register">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegPrompt;

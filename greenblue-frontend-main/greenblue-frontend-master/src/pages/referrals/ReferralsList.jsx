import React, { useState, useEffect } from "react";
import UserInfo from "./UserInfo";
const ReferralsList = (props) => {
  const level = props.level;
  const generations = props.generations;
  return (
    <div style={{ marginTop: 10 }}>
      <h1 className="text-xl text-bold p-2">Users on level {props.level}</h1>
      <div className="overflow-x-auto">
        <table className="table  w-full">
          <thead>
            <tr>
              <th></th>
              <th>Join Date</th>
              <th>Name</th>
              <th>Country</th>
              <th>Account Status</th>
              <th>Packs Purchases</th>
            </tr>
          </thead>
          <tbody>
            {generations
              .filter((generation) => generation.generation_level_id == level)
              .map((gen, index) => {
                return (
                  <UserInfo id={gen.user_id} index={index} level={level} />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralsList;

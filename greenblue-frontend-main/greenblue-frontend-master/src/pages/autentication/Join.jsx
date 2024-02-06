import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Join = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reg_reducer = props.appState.registerReducer;
  useEffect(() => {
    setReferral();
  }, []);
  const setReferral = async () => {
    const data = {
      userExist: reg_reducer.userExist,
      started: reg_reducer.started, //WHEN  PROCESS STARTS
      ended: reg_reducer.ended, //UPDATE WHEN IT"S COMPLETE
      phone_verified: reg_reducer.phone_verified, //AFTER AN OPT VEROIFICATION IS DONE
      email_verified: reg_reducer.email_verified, //IF LOGIN VIA SOCIAL MEDIA SET TO TRUE
      first_name: reg_reducer.first_name,
      last_name: reg_reducer.last_name,
      email: reg_reducer.email,
      phone: reg_reducer.phone,
      referrered_by: id,
      country: reg_reducer.country,
      passwordSet: reg_reducer.passwordSet,
      access_token: reg_reducer.access_token,
    };
    await props.registerState(data);
    navigate("/register");
  };
  return <div></div>;
};

export default Join;

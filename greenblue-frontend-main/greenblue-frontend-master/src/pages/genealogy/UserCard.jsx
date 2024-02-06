import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const UserCard = (props) => {
  const generation = props.generation;
  const { baseUrl } = useURL();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = async () => {
    axios
      .get(`${baseUrl}/api/v1/user?id=${props.user_id}`)
      .then((res) => {
        // console.log(res.data);
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={`card card-compact bg-base-100 `} style={{ width: "80%" }}>
      <figure>
        <div className="avatar p-2">
          <div className="w-16 mask mask-squircle ">
            <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
          </div>
        </div>
      </figure>
      {loading == true ? (
        <div className="card-body items-center">
          <ThreeDots
            height="50"
            width="50"
            radius="5"
            color="#e8edf4"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      ) : (
        <div
          onClick={() => props.setUserId(props.user_id)}
          className="card-body items-center p-2"
        >
          <h2 className="card-title text-xl">
            {user.first_name} {user.last_name}
          </h2>
          {user.account_status.acc_status== true ? (
            <div className="badge badge-success">Active</div>
          ) : (
            <div className="badge">inactive</div>
          )}

          <h2 className="card-title text-2xl">{user.username}</h2>
        </div>
      )}
    </div>
  );
};

export default UserCard;

import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import moment from "moment";

const UserDetails = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  const getUserProfile = async () => {
    axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      // console.log(res.data);
      setUser(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      {loading == true ? (
        <div className="items-center">
          <ThreeDots
            height="100"
            width="100"
            radius="9"
            color="#8d949e"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 md:gap-2 ">
          <div style={{ backgroundColor: "white", borderRadius: 10 }}>
            <div className="card card-compact w-full bg-base-100">
              <figure>
                <img
                  src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1681301631/Screenshot_76_xlpyqm.png"
                  alt="trees"
                />
              </figure>
              <div className="avatar p-2 " style={{ marginTop: -80 }}>
                <div className="w-28 mask mask-squircle ">
                  <img src="https://res.cloudinary.com/hzurp2z3v/image/upload/v1680531236/young-cheerful-man-laughing_107173-11128_f2danf.jpg" />
                </div>
              </div>
              <div className="card-body">
                <div>
                  <p className="text-bold card-title">{user.account_number}</p>
                  <ul className="menu bg-base-100 w-56 p-2 rounded-box">
                    <li>
                      <a>
                        <i class="fas fa-user-alt"></i> {user.first_name}{" "}
                        {user.last_name}
                      </a>
                    </li>
                    <li>
                      <a>
                        <i class="fas fa-envelope"></i> {user.email}
                      </a>
                    </li>
                    <li>
                      <a>
                        <i class="fas fa-phone-alt"></i>
                        {user.phone}
                      </a>
                    </li>
                    <li>
                      <a>
                        <i class="fas fa-flag"></i>
                        {user.country.name}( {user.country.code})
                      </a>
                    </li>
                  </ul>
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-primary">
                      Edit Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="card w-full bg-base-100 shadow-xl md:mt-0 mt-4">
              <div className="card-body">
                <h2 className="card-title">Account Info</h2>
                <p>Manage your account with ease</p>
                <p>
                  <strong> Member Since</strong> <br />
                  {moment(user.createdAt).fromNow()}
                </p>
                <p>
                  <strong> Account Status</strong> <br />
                  {user.account_status != null
                    ? user.account_status.status_id
                    : "In Active"}
                </p>
                <p>
                  <strong> Referred By</strong> <br />
                  {user.referrer ? user.referrer.account_no : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;

import axios from "axios";
import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import dateFormat from "dateformat";

const UserInfo = (props) => {
  const id = props.id;
  const index = props.index;
  const { baseUrl } = useURL();
  const level = props.level;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, [level]);
  const getUser = async () => {
    axios.get(`${baseUrl}/api/v1/user?id=${id}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  };
  return (
    <>
      {loading ? (
        <tr>
          <th></th>
          <td>
            <progress className="progress w-full"></progress>
          </td>
          <td>
            <progress className="progress w-full"></progress>
          </td>
          <td>
            <progress className="progress w-full"></progress>
          </td>
          <td>
            <progress className="progress w-full"></progress>
          </td>
        </tr>
      ) : (
        <tr>
          <th>{index + 1}</th>
          <td>{dateFormat(user.createdAt, "mmmm dS, yyyy, h:MM")}</td>
          <td>
            {user.first_name} {user.last_name}
          </td>
          <td>
            {user.county.name}({user.county.code})
          </td>
          <td>
            {user.account_status != null
              ? user.account_status.status_id
              : "Pending"}
          </td>
          <td>
            {user.packages.map((pack) => {
              return (
                <li>
                  {pack.amount} USD
                  <span className="stat-desc">
                    {" "}
                    on {dateFormat(pack.createdAt, "mmmm dS, yyyy, h:MM")}
                  </span>
                </li>
              );
            })}
          </td>
        </tr>
      )}
    </>
  );
};

export default UserInfo;

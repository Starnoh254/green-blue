import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
import axios from "axios";
import useURL from "../../hooks/useURL";
import { ThreeDots } from "react-loader-spinner";

const TransferDetails = (props) => {
  const transfer = props.transfer;
  const index = props.index;
  const user = props.user;
  const [user2, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getSentReceivedUser();
  }, []);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  const getSentReceivedUser = async () => {
    const user_id =
      transfer.to_user_id == user.id
        ? transfer.from_user_id
        : transfer.to_user_id;
    await axios
      .get(`${baseUrl}/api/v1/user?id=${user_id}`, config)
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
    <tr>
      <th>
        <span style={{ marginRight: 5 }}>{index + 1}</span>
        <span>
          {!loading &&
            (transfer.to_user_id == user._id ? (
              <i
                class="fas fa-compress-alt"
                style={{ color: " #13d89d", fontSize: 22 }}
              ></i>
            ) : (
              <i
                class="fas fa-expand-alt"
                style={{ color: "#e91635", fontSize: 22 }}
              ></i>
            ))}
        </span>
      </th>
      <td>{dateFormat(transfer.createdAt, "mmmm dS, yyyy, h:MM")}</td>
      <td>
        {!loading ? (
          <>
            {transfer.to_user_id == user._id
              ? `Received from ${user2.first_name} ${user2.last_name}`
              : `Sent to ${user2.first_name} ${user2.last_name}`}
          </>
        ) : (
          <ThreeDots
            height="30"
            width="30"
            radius="5"
            color="#e4e5e7"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName="items-center"
            visible={true}
          />
        )}
      </td>
      <td>{transfer.amount} USD</td>
      <td>
        {transfer.status == "completed" ? (
          <div className="badge badge-success">{transfer.status}</div>
        ) : (
          <div className="badge">{transfer.status}</div>
        )}
      </td>
    </tr>
  );
};

export default TransferDetails;

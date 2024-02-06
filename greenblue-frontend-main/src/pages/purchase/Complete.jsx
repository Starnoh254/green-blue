import axios from "axios";
import React, { useState, useEffect } from "react";
import useURL from "../../hooks/useURL";
import { toast } from "react-toastify";
const Complete = (props) => {
  const user = props.user;
  //GET USER PACKAGES
  const token = props.appState.loginReducer.token;
  // console.log(token);
  const [user_packages, setUserPackages] = useState([]);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [is_sent, setIsSent] = useState(false);
  const { baseUrl } = useURL();
  useEffect(() => {
    getPacks();
  }, []);
  const getPacks = async () => {
    await axios
      .get(`${baseUrl}/api/v1/user/packages`, config)
      .then((res) => {
        // console.log(res.data);
        setUserPackages(res.data.user_packages);
        // initSMS(res.data.user_packages);
      })
      .catch((error) => props.logoutUser());
  };

  const initSMS = async (packages) => {
    var count = 0;
    if (packages.length == 1) {
      if (!is_sent) {
        await setIsSent(true);
        if (count == 0) {
          count++;
          // await sendWelcomeSms();
        }
      }
    }
  };
  const sendWelcomeSms = async () => {
    const data = {
      messages: [
        {
          destinations: [
            {
              to: user.phone,
            },
          ],
          from: "InfoSMS",
          text: `Welcome to GBFA! Your Acc No: ${user.account_number} and refferal link is https://https://greenbluefoundation.org/join/${user.account_number}`,
        },
      ],
    };
    const config = {
      headers: {
        Authorization: `App 7617bc57d64c0cb69215bb1910e39ac0-4ab4c0de-3dc8-4c44-990d-c603ed08d3b3`,
      },
    };
    {
      !is_sent &&
        (await axios
          .post(
            `https://3vy5xm.api.infobip.com/sms/2/text/advanced`,
            data,
            config
          )
          .then((res) => {
            toast.success(
              `Welcome to GBFA! Your Acc No: ${user.account_number} and refferal link is https://https://greenbluefoundation.org/join/${user.account_number}. You will also receive a message this details!!`,
              {
                theme: "colored",
              }
            );
          })
          .catch((err) => {
            console.log(err);
          }));
    }
  };
  return (
    <div>
      <div className="alert alert-success shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Payment successfully completed and package has been activated!
          </span>
        </div>
      </div>
      <p className="mt-10">
        You have succesfully made your purchase, let's join hands and PLANT MORE
        TREES!!
      </p>
    </div>
  );
};

export default Complete;

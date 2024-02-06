import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {ToastContainer,toast} from "react-toastify"
import PI from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import useURL from "../../hooks/useURL";
const SponsorForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [trees, setTrees] = useState("");
  const [company, setCompany] = useState("");
  const [country_code, setCountryCode] = useState("");
  const PhoneInput = PI.default ? PI.default : PI;
  const [value, setValue] = useState("");
  const { type } = useParams();
  const cost_per_tree = 3;
  const current_rate = 151
  const amount = trees * cost_per_tree * current_rate
  const registerSponsor = async()=>{
    pushStk()
  }
  const { baseUrl, baseWss } = useURL();
  const pushStk = async () => {
    // const payment = props.payment;
    setLoading(true);
    const url = `${baseUrl}/api/v1/stkPushReg`;
    await axios
      .post(url, {
        amount: amount,
        phone: value,
        code: null,
        user_id: null
      })
      .then((res) => {
        // openConnection();
        setLoading(false);
        toast.success("Please folow the oinstructions on your m-pesa", {
          theme: "colored",
        });
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <div className="container mx-auto">
      <ToastContainer/>
      <div className="grid grid-cols-1 gap-2 p-10">
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            {type == "individual" ? (
              <div>
                {" "}
                <h2 className="card-title">
                  Register as an Individual Sponsor
                </h2>
                <p>
                  Help the community grow trees, all trees planted will be
                  mapped for easy monitoring
                </p>
                <div>
                  <label className="label">
                    <span className="label-text text-bold">First Name</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={first_name}
                    placeholder="Enter First Name"
                    autoComplete="off"
                    className="input input-bordered input-md w-full p-4  block  w-full text-md"
                    onChange={() => setFirstName(event.target.value)}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-bold">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    placeholder="Enter Last Name"
                    value={last_name}
                    autoComplete="off"
                    className="input input-bordered input-md w-full p-4  block w-full text-md"
                    required
                    onChange={() => setLastName(event.target.value)}
                  />
                </div>
                <div className="pt-5">
                  <PhoneInput
                    country={"ke"}
                    autoFormat={true}
                    placeholder="Enter phone number"
                    value={value}
                    onChange={(phone) => setValue(phone)}
                    inputStyle={{
                      width: "100%",
                      paddingTop: 12,
                      paddingBottom: 12,
                      fontWeight: "600",
                    }}
                  />
                </div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text text-bold">Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    autoComplete="off"
                    placeholder="Enter email address"
                    required
                    onChange={() => setEmail(event.target.value)}
                    className="input input-bordered input-md w-full p-4  block w-full text-md"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-bold">
                      Number of Tree to grow
                    </span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    placeholder="Enter trees"
                    value={trees}
                    autoComplete="off"
                    className="input input-bordered input-md w-full p-4  block w-full text-md"
                    required
                    onChange={() => setTrees(event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="card-title">
                  Register your Company/Organization as a sponsor{" "}
                </h2>
                <p>
                  Help the community grow trees, all trees planted will be
                  mapped for easy monitoring
                </p>
                <div>
                  {" "}
                  <div>
                    <label className="label">
                      <span className="label-text text-bold">
                        Company / Organization Name
                      </span>
                    </label>
                    <input
                      type="text"
                      id="orgname"
                      value={company}
                      placeholder="Enter Company Name"
                      autoComplete="off"
                      className="input input-bordered input-md w-full p-4  block  w-full text-md"
                      onChange={() => setCompany(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-bold">First Name</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      value={first_name}
                      placeholder="Enter First Name"
                      autoComplete="off"
                      className="input input-bordered input-md w-full p-4  block  w-full text-md"
                      onChange={() => setFirstName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-bold">Last Name</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      placeholder="Enter Last Name"
                      value={last_name}
                      autoComplete="off"
                      className="input input-bordered input-md w-full p-4  block w-full text-md"
                      required
                      onChange={() => setLastName(event.target.value)}
                    />
                  </div>
                  <div className="pt-5">
                    <PhoneInput
                      country={"ke"}
                      autoFormat={true}
                      placeholder="Enter phone number"
                      value={value}
                      onChange={(phone) => setValue(phone)}
                      inputStyle={{
                        width: "100%",
                        paddingTop: 12,
                        paddingBottom: 12,
                        fontWeight: "600",
                      }}
                    />
                  </div>
                  <div className="form-control w-full ">
                    <label className="label">
                      <span className="label-text text-bold">
                        Email Address
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      autoComplete="off"
                      placeholder="Enter email address"
                      required
                      onChange={() => setEmail(event.target.value)}
                      className="input input-bordered input-md w-full p-4  block w-full text-md"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-bold">
                        Number of Tree to grow
                      </span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      placeholder="Enter trees"
                      value={trees}
                      autoComplete="off"
                      className="input input-bordered input-md w-full p-4  block w-full text-md"
                      required
                      onChange={() => setTrees(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="card-actions justify-end">
              <button onClick={()=>registerSponsor()} className="btn btn-primary">register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorForm;

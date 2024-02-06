import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useURL from "../../hooks/useURL";
import axios from "axios";
import { connect } from "react-redux";
const ChoosePack = (props) => {
  const packs = props.packs;
  const user = props.user;
  const [selected, setSelected] = useState(null);
  const [user_packages, setUserPackages] = useState([]);
  const [rate, setRate] = useState(null);
  const getSelectedPack = (id) => {
    const pack = packs.filter((pac) => pac._id == id);
    setSelected(pack);
    props.setPack(pack[0]);
  };
  useEffect(() => {
    newRate();
    getPacks();
  }, [props.deposit_rate]);
  const newRate = async () => {
    const margin = (Number(props.rate) * Number(props.deposit_rate)) / 100;
    const newRate = Number(props.rate) + margin;
    setRate(Number(newRate).toFixed(2));
  };
  const current_pack = packs.filter((pack) => pack._id == user.package_id);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  const getPacks = async () => {
    await axios
      .get(`${baseUrl}/api/v1/user/packages`, config)
      .then((res) => {
        // console.log(res.data);
        setUserPackages(res.data.user_packages);
      })
      .catch((error) => props.logoutUser());
  };

  return (
    <div className="grid md:grid-cols-2 md:gap-2 ">
      <div>
        <div>
          <h1 className="p-2 text-xl text-bold">
            Select your preferred package
          </h1>
          <select
            className="select w-full select-bordered max-w-xs "
            onChange={() => getSelectedPack(event.target.value)}
          >
            <option disabled selected>
              Select Preferred Pack
            </option>
            {packs.map((pack, index) => {
              return (
                <option
                  value={pack._id}
                  disabled={user_packages.length != index ? true : false}
                >
                  {pack.title}(${pack.amount})
                </option>
              );
            })}
          </select>
        </div>
        <br />
        <div>
          <button
            onClick={
              selected == null
                ? () =>
                    toast.error("Please select a package", { theme: "colored" })
                : () => props.setStep(2)
            }
            className="btn btn-success"
          >
            Continue
          </button>
        </div>
      </div>
      <div>
        {selected !== null && (
          <div>
            <div className="card w-full bg-base-100 card-bordered md:mt-0 mt-4	">
              <div className="card-body md:p-4 p-4">
                <h2 className="card-title">Conversion</h2>
                <p style={{ fontSize: 11 }}>
                  1 USD = {props.currency} {rate}
                </p>

                <p>
                  <strong>
                    {selected[0].amount} USD = {props.currency}{" "}
                    {Number(rate * selected[0].amount).toFixed(2)}
                  </strong>
                </p>
                <br />
                <p>
                  NB: This amount might change depending on the price of the
                  dollar at the time of your subscription
                </p>
              </div>
            </div>
            <br />
          </div>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(ChoosePack);

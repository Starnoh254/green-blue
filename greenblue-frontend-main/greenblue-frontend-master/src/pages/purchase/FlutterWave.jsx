import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import useURL from "../../hooks/useURL";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const FlutterWave = (props) => {
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useURL();
  // console.log(props.payment);
  const config = {
    public_key: "FLWPUBK-8da398a0c2c70df131c2536d4c4f083e-X",
    tx_ref: Date.now(),
    amount: props.payment.amount_in_local_curency,
    currency: props.currency,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: props.user.email,
      phone_number: props.user.phone,
      name: `${props.user.first_name} ${props.user.last_name}`,
    },
    customizations: {
      title: "Green Blue Foundation Afria",
      description: `Purchasing ${props.pack.title} @ ${props.payment.amount} USD`,
      logo: "https://res.cloudinary.com/hzurp2z3v/image/upload/v1680438213/logo__1_-removebg-preview_1_mgbgng.png",
    },
  };
  const handleFlutterPayment = useFlutterwave(config);
  const token = props.appState.loginReducer.token;
  const config1 = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const flutterCallback = async (response) => {
    if (response.data.status === "successful") {
      axios
        .post(
          `${baseUrl}/api/v1/flutter/package/callback?payment_id=${props.payment._id}`,
          { status_code: 0 },
          config1
        )
        .then((res) => {
          props.setStep(4);
          props.getPayments();
          toast.success(
            "Payment processed successfully.You are being redirected",
            {
              theme: "colored",
            }
          );
        });
    } else {
      toast.error(
        "You payment could not be processed. Please try using another method",
        {
          theme: "colored",
        }
      );
    }
  };
  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-2 ">
        <div>
          <h1 className="text-bold text-xl">Use Card Payment</h1>
          <p>Amount will be billed in {props.currency}</p>
          <br />
          <button
            disabled={loading}
            className={`btn ${loading && "loading"} btn-warning`}
            onClick={() => {
              setLoading(true);
              handleFlutterPayment({
                callback: (response) => {
                  flutterCallback(response);
                  closePaymentModal(); // this will close the modal programmatically
                  setLoading(false);
                },
                onClose: () => {
                  setLoading(false);
                  toast.error(
                    "You payment could not be processed. Please try again",
                    {
                      theme: "colored",
                    }
                  );
                },
              });
            }}
          >
            Continue to Payment
          </button>
        </div>
        <div>
          <div className="card w-full bg-base-100 card-bordered	">
            <div className="card-body">
              <h2 className="card-title">Amount to Pay</h2>
              <p style={{ fontSize: 11 }}>
                1 USD = {props.currency} {props.rate}
              </p>
              <p>
                <strong>
                  {props.payment.amount} USD = {props.currency}{" "}
                  {Number(props.payment.amount * props.rate).toFixed(2)}
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
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(FlutterWave);

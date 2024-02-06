import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
const ReferralLink = (props) => {
  const user = props.user;
  //   console.log(user);
  return (
    <div>
      <form>
        <div class="relative">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <img
              style={{ width: 20 }}
              src="https://res.cloudinary.com/hhaouoiov/image/upload/v1669991338/link_olnlk8.png"
            />
          </div>
          <input
            type="search"
            id="default-search"
            className="input input-bordered input-md w-full  block pl-10 w-full text-md"
            defaultValue={`https://${window.location.host}/join/${user.account_number}`}
            required
          />
          <CopyToClipboard
            text={`https://${window.location.host}/join/${user.account_number}`}
            onCopy={() => {
              toast.success("You have successfully copied your link", {
                theme: "colored",
              });
            }}
          >
            <button
              type="button"
              className="btn btn-sm btn-secondary text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300  "
            >
              Copy
            </button>
          </CopyToClipboard>
        </div>
      </form>
    </div>
  );
};

export default ReferralLink;

import React, { useState, useEffect } from "react";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import SupportStats from "./SupportStats";

const Support = (props) => {
  return (
    <div>
      <div>
        <Topbar />
        <div class=" shadow bg-base-200 drawer drawer-mobile">
          <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
          <div class="flex flex-col drawer-content">
            <label
              for="my-drawer-2"
              class="mb-4 btn btn-primary drawer-button lg:hidden"
            >
              open menu
            </label>
            <div
              class="hidden lg:block "
              style={{
                backgroundColor: "#f6f7f8",
                height: "100vh",
                width: "100%",
                padding: 10,
              }}
            >
              <SupportStats />
            </div>
            <div class="text-xs text-center lg:hidden">
              Menu can be toggled on mobile size.
              <p>Resize the browser to see fixed sidebar on desktop size</p>
            </div>
          </div>
          <div
            class="drawer-side"
            style={{ backgroundColor: "#f6f7f8", borderRadius: 0 }}
          >
            <label for="my-drawer-2" class="drawer-overlay"></label>
            <Sidebar logoutUser={props.logoutUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

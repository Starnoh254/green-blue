import React, { useState, useEffect } from "react";
import TreeView from "./TreeView";
import { connect } from "react-redux";
import useURL from "../../hooks/useURL";
import axios from "axios";
import Topbar from "../dashboard/Topbar";
import Sidebar from "../dashboard/Sidebar";
import { isMobile } from "react-device-detect";
import LoadingOverlay from "react-loading-overlay";
import { ThreeDots } from "react-loader-spinner";
const Genealogy = (props) => {
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [treeArr, setTreeArr] = useState([]);
  const token = props.appState.loginReducer.token;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const { baseUrl } = useURL();
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    await axios.get(`${baseUrl}/api/v1/profile`, config).then((res) => {
      setUserId(res.data._id);
      getGenerations(res.data._id);
    });
  };
  const getGenerations = async (id) => {
    await axios
      .get(`${baseUrl}/api/v1/user_generations?user_id=${id}`, config)
      .then((res) => {
        // console.log(res.data.tree);
        setGenerations(res.data.tree[0].children);
        // setUserId[res.data.tree[0].user_id];
        const gens = res.data.tree[0].children
          .filter((c) => c.generation_level_id == 1)
          .map((child) => {
            return { user_id: child.user_id, children: child.children };
          });
        const tree = [{ user_id: res.data.tree[0].user_id, children: gens }];
        setTreeArr(tree);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (user_id != null) {
      setLoading(true);
      getGenerations(user_id);
    }
  }, [user_id]);
  return (
    <div>
      <Topbar />
      <div class=" shadow bg-base-200 drawer drawer-mobile">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div class="flex flex-col drawer-content">
          <div
            class="hidden lg:block "
            style={{ backgroundColor: "#f6f7f8", width: "100%" }}
          >
            {!loading ? (
              <TreeView generations={treeArr} setUserId={setUserId} />
            ) : (
              <LoadingOverlay
                active={loading}
                spinner={
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
                }
              ></LoadingOverlay>
            )}
          </div>
          <div class="text-xs text-center lg:hidden">
            {!loading && (
              <TreeView generations={treeArr} setUserId={setUserId} />
            )}
          </div>
        </div>
        <div className="drawer-side" style={{ backgroundColor: "#f6f7f8" }}>
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          {isMobile ? (
            <ul
              className="menu p-4 w-80  text-base-content"
              style={{ backgroundColor: "#f6f7f8" }}
            >
              <Sidebar logoutUser={props.logoutUser} />
            </ul>
          ) : (
            <Sidebar logoutUser={props.logoutUser} />
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(Genealogy);

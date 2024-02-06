import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import orgChartJson from "./data/org-chart.json";
import { useCenteredTree } from "./helpers";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
import { Edit, AttachMoney, Accessible } from "@material-ui/icons";
import { connect } from "react-redux";
import axios from "axios";
import useURL from "../../hooks/useURL";
import UserCard from "./UserCard";
const containerStyles = {
  width: "100vw",
  height: "100vh",
  background: "#eee",
};

const useStyles = makeStyles(
  createStyles({
    button: {
      position: "relative",
      width: "150px",
      height: "150px",
      background: "white",
      color: "black",
      "& > span": {
        flexFlow: "column",
      },
      "&:hover": {
        background: "white",
      },
    },
    name: {
      fontSize: "16px",
    },
    edit: {
      position: "absolute",
      top: "0px",
      right: "0px",
      color: "#4BA083",
    },
    attributes: {
      position: "absolute",
      bottom: "5px",
      right: "10px",
    },
  })
);

const TreeView = (props) => {
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
    classes,
  }) => (
    <>
      <foreignObject {...foreignObjectProps}>
        <UserCard
          user_id={nodeDatum.user_id}
          generation={nodeDatum}
          setUserId={props.setUserId}
        />
      </foreignObject>
    </>
  );
  const classes = useStyles();
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 400, y: 600 };
  const separation = { siblings: 1, nonSiblings: 2 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -150 };
  const generations = props.generations;
  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={generations}
        translate={translate}
        nodeSize={nodeSize}
        separation={separation}
        transitionDuration="1000"
        pathFunc="step"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, classes })
        }
        orientation="vertical"
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appState: state,
  };
};
export default connect(mapStateToProps)(TreeView);

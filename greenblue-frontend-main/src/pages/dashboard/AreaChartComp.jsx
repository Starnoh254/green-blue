import React, { PureComponent } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { isMobile } from "react-device-detect";
const AreaChartComp = (props) => {
  const data = props.commission_by_date;
  return (
    <div style={{ width: "100%" }}>
      {data.length == 0 ? (
        <div>
          <h1 style={{ textTransform: "uppercase" }}>No Data to report yet</h1>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 320}>
          <AreaChart
            width={500}
            height={250}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sum"
              stroke="#82a656 "
              fill="#82a656 "
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AreaChartComp;

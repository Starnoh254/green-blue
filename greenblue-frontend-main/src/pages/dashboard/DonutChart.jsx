import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { isMobile } from "react-device-detect";
// const data = [
//   { name: "Active Users", value: 9 },
//   { name: "Inactive Users", value: 18 },
// ];
const COLORS = ["#82a656", "#2c4c62"];
const DonutChart = (props) => {
  // console.log(props);
  const data = [
    { name: "Active Users", value: props.stats.active_referrals },
    { name: "Inactive Users", value: props.stats.inactive_referrals },
  ];
  const total = data.reduce((a, b) => Number(a.value) + Number(b.value));
  return (
    <div>
      {total == 0 ? (
        <div>
          <h1 style={{ textTransform: "uppercase" }}>No Data to report yet</h1>
        </div>
      ) : (
        <PieChart width={300} height={isMobile ? 120 : 240}>
          <Pie
            data={data}
            innerRadius={isMobile ? 25 : 40}
            outerRadius={isMobile ? 40 : 80}
            fill="#010102"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );
};

export default DonutChart;

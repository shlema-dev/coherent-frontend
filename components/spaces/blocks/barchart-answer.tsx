import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface BarchartAnswerProps {
  content: {
    [key: string]: number;
  };
}

const RoundedBar: React.FC<any> = ({ fill, x, y, width, height }) => {
  return (
    <rect x={x} y={y} rx={5} ry={5} width={width} height={height} fill={fill} />
  );
};

const BarchartAnswerComponent: React.FC<BarchartAnswerProps> = ({
  content,
}) => {
  const dataCount = Object.keys(content).length;

  if (!content) {
    return <p>No data available</p>;
  }

  if (dataCount < 3) {
    return <p>There are not enough data points to create a chart.</p>;
  }

  if (dataCount > 10) {
    return <p>There are too many data points to map to a bar chart.</p>;
  }

  const chartData = Object.keys(content).map((key) => ({
    name: key,
    value: content[key as keyof typeof content],
  }));

  const maxValue = Math.max(...chartData.map((entry) => entry.value));

  let stepSize = 1;
  if (maxValue > 100) {
    stepSize = 20;
  } else if (maxValue > 50) {
    stepSize = 10;
  } else if (maxValue > 20) {
    stepSize = 5;
  } else {
    stepSize = 2;
  }

  const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
  const yAxisTicks = Array.from(
    { length: yAxisMax / stepSize + 1 },
    (_, i) => i * stepSize,
  );

  return (
    <ResponsiveContainer width="100%" height={300} className="w-full max-w-3xl">
      <BarChart
        data={chartData}
        margin={{
          top: 30,
          right: 0,
          left: -32,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" axisLine={false} />
        <YAxis domain={[0, yAxisMax]} ticks={yAxisTicks} />
        <Tooltip cursor={<Rectangle fill="#FFF0EE" />} />
        {yAxisTicks.map((tick, index) => (
          <ReferenceLine
            y={tick}
            stroke="#EDEDED"
            isFront={false}
            key={`ref-line-${index}`}
          />
        ))}
        <Bar
          dataKey="value"
          shape={(props) => <RoundedBar {...props} />}
          fill="#E54D2E"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarchartAnswerComponent;

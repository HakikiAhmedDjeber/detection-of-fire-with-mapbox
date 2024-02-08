import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 250, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 100, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 300, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 350, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 250, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 100, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 300, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 350, pv: 2400, amt: 2400 },
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 250, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 100, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 300, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 350, pv: 2400, amt: 2400 },
];

export default function Chart({ chartOpen, handleChart }) {
  return (
    <div className={`chart ${chartOpen ? "chartUp" : ""}`}>
      <div className="chartClose" onClick={() => handleChart()}>
        &#10006;
      </div>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </div>
  );
}

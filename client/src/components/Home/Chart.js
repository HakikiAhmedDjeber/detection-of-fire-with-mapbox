import { useState, useEffect } from "react";
import {
  AreaChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
export default function Chart({ chartOpen, handleChart, sensorId }) {
  const [closeChart, setChartClose] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random temperature between 19 and 22
      const newTemperature = Math.floor(Math.random() * 4) + 19;
      // Get current time
      const now = new Date();
      // Format time as "HH:MM:SS"
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      // Update data with new temperature and time
      setData((prevData) => [
        ...prevData,
        { time, temperature: newTemperature },
      ]);
    }, 5000); // Every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []); // Run effect only once on mount
  return (
    <div className={`chart ${chartOpen ? "chartUp" : ""}`}>
      <div className="chartClose" onClick={() => handleChart()}>
        &#10006;
      </div>
      <AreaChart width={800} height={300} data={data}>
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
      </AreaChart>
      <div className="link">
        <Link to={`/history/${sensorId}`}>see details</Link>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import MapGl, { Marker, Popup, useMap } from "react-map-gl";
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
  Bar,
  BarChart,
  Cell,
} from "recharts";
import { useLazyQuery } from "@apollo/client";
import {
  GET_ALL_SENSSED_DATA,
  GET_ALL_SENSSED_DATA_BY_DEVICE,
} from "../../GraphQL/queries";
import "./history.css";
const accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

const temperatureData = [
  { date: "2024-01-22", temperature: 22.5 },
  { date: "2024-01-23", temperature: 17 },
  { date: "2024-01-24", temperature: 16 },
  { date: "2024-01-25", temperature: 20 },
  { date: "2024-01-26", temperature: 20 },
  { date: "2024-01-27", temperature: 21 },
  { date: "2024-01-28", temperature: 22 },
  { date: "2024-01-29", temperature: 22 },
  { date: "2024-01-30", temperature: 24 },
  { date: "2024-01-31", temperature: 23 },
  { date: "2024-02-01", temperature: 22 },
  { date: "2024-02-02", temperature: 16 },
  { date: "2024-02-03", temperature: 20 },
  { date: "2024-02-04", temperature: 19 },
  { date: "2024-02-05", temperature: 18 },
  { date: "2024-02-06", temperature: 23 },
  { date: "2024-02-07", temperature: 16 },
  { date: "2024-02-08", temperature: 21 },
  { date: "2024-02-09", temperature: 18 },
  { date: "2024-02-10", temperature: 21 },
];

const humidityData = [
  { date: "2024-01-22", humidity: 60 },
  { date: "2024-01-23", humidity: 65 },
  { date: "2024-01-24", humidity: 62 },
  { date: "2024-01-25", humidity: 70 },
  { date: "2024-01-26", humidity: 72 },
  { date: "2024-01-27", humidity: 68 },
  { date: "2024-01-28", humidity: 66 },
  { date: "2024-01-29", humidity: 64 },
  { date: "2024-01-30", humidity: 68 },
  { date: "2024-01-31", humidity: 71 },
  { date: "2024-02-01", humidity: 69 },
  { date: "2024-02-02", humidity: 62 },
  { date: "2024-02-03", humidity: 65 },
  { date: "2024-02-04", humidity: 68 },
  { date: "2024-02-05", humidity: 67 },
  { date: "2024-02-06", humidity: 70 },
  { date: "2024-02-07", humidity: 63 },
  { date: "2024-02-08", humidity: 66 },
  { date: "2024-02-09", humidity: 68 },
  { date: "2024-02-10", humidity: 64 },
];

const gasData = [
  { date: "2024-01-22", gasConcentration: 150 },
  { date: "2024-01-23", gasConcentration: 160 },
  { date: "2024-01-24", gasConcentration: 155 },
  { date: "2024-01-25", gasConcentration: 170 },
  { date: "2024-01-26", gasConcentration: 175 },
  { date: "2024-01-27", gasConcentration: 165 },
  { date: "2024-01-28", gasConcentration: 160 },
  { date: "2024-01-29", gasConcentration: 155 },
  { date: "2024-01-30", gasConcentration: 165 },
  { date: "2024-01-31", gasConcentration: 170 },
  { date: "2024-02-01", gasConcentration: 160 },
  { date: "2024-02-02", gasConcentration: 155 },
  { date: "2024-02-03", gasConcentration: 160 },
  { date: "2024-02-04", gasConcentration: 165 },
  { date: "2024-02-05", gasConcentration: 170 },
  { date: "2024-02-06", gasConcentration: 175 },
  { date: "2024-02-07", gasConcentration: 160 },
  { date: "2024-02-08", gasConcentration: 165 },
  { date: "2024-02-09", gasConcentration: 160 },
  { date: "2024-02-10", gasConcentration: 155 },
];

const airQualityData = [
  { date: "2024-01-22", aqi: 45 },
  { date: "2024-01-23", aqi: 50 },
  { date: "2024-01-24", aqi: 48 },
  { date: "2024-01-25", aqi: 55 },
  { date: "2024-01-26", aqi: 60 },
  { date: "2024-01-27", aqi: 52 },
  { date: "2024-01-28", aqi: 49 },
  { date: "2024-01-29", aqi: 47 },
  { date: "2024-01-30", aqi: 53 },
  { date: "2024-01-31", aqi: 58 },
  { date: "2024-02-01", aqi: 50 },
  { date: "2024-02-02", aqi: 48 },
  { date: "2024-02-03", aqi: 50 },
  { date: "2024-02-04", aqi: 54 },
  { date: "2024-02-05", aqi: 57 },
  { date: "2024-02-06", aqi: 61 },
  { date: "2024-02-07", aqi: 49 },
  { date: "2024-02-08", aqi: 52 },
  { date: "2024-02-09", aqi: 47 },
  { date: "2024-02-10", aqi: 45 },
];

const fireData = [
  { label: "Fire", value: 2 },
  { label: "No-fire", value: 18 },
];

const lightData = [
  { date: "2024-01-22", lightIntensity: 300 },
  { date: "2024-01-23", lightIntensity: 280 },
  { date: "2024-01-24", lightIntensity: 320 },
  { date: "2024-01-25", lightIntensity: 290 },
  { date: "2024-01-26", lightIntensity: 310 },
  { date: "2024-01-27", lightIntensity: 330 },
  { date: "2024-01-28", lightIntensity: 280 },
  { date: "2024-01-29", lightIntensity: 310 },
  { date: "2024-01-30", lightIntensity: 290 },
  { date: "2024-01-31", lightIntensity: 300 },
  { date: "2024-02-01", lightIntensity: 320 },
  { date: "2024-02-02", lightIntensity: 330 },
  { date: "2024-02-03", lightIntensity: 310 },
  { date: "2024-02-04", lightIntensity: 280 },
  { date: "2024-02-05", lightIntensity: 290 },
  { date: "2024-02-06", lightIntensity: 300 },
  { date: "2024-02-07", lightIntensity: 320 },
  { date: "2024-02-08", lightIntensity: 310 },
  { date: "2024-02-09", lightIntensity: 330 },
  { date: "2024-02-10", lightIntensity: 300 },
];

export default function History() {
  const [sensorData, setSensorData] = useState([]);
  // get data by device ID
  const [
    getAllSenssedDataByDevice,
    { loading: isDLoading, data: DeviceResponseData, error: queryDeviceError },
  ] = useLazyQuery(GET_ALL_SENSSED_DATA_BY_DEVICE); //  ADD new this will fetch all data by deviceID

  // send the query
  useEffect(() => {
    getAllSenssedDataByDevice({ variables: { deviceId: "123" } }); // excute fetch data only for single device
  }, []);

  useEffect(() => {
    if (!isDLoading) {
      if (queryDeviceError) {
        console.log(queryDeviceError);
      }
      if (DeviceResponseData) {
        console.log(
          "Recieved Data from single device ==> ",
          DeviceResponseData?.GetAllSenssedDataByDevice.data
        );
        setSensorData(DeviceResponseData?.GetAllSenssedDataByDevice.data);
      }
    }
  }, [isDLoading, DeviceResponseData, queryDeviceError]);

  return (
    <div className="history">
      <Header />
      <div className="main">
        <div className="container">
          <div className="map-and-fire">
            <Map />
            <div className="fire">
              <h2>Fires : </h2>
              <div className="info">
                <p className="fires-time">2</p>
                <img src="./fire.png" alt="fire" />
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <h1>Temperature</h1>
              <Chart
                chartType="area"
                color="#ea4d26a6"
                data={sensorData}
                dataKey="Temperature"
              />
            </div>
            <div className="stat">
              <h1>Humidity</h1>
              <Chart
                chartType="area"
                color="#149DE0"
                data={sensorData}
                dataKey="Humidity"
              />
            </div>
            <div className="stat light">
              <h1>Gas</h1>
              <Chart
                chartType="line"
                color="#ccc"
                data={sensorData}
                dataKey="Gas"
              />
            </div>
            <div className="stat">
              <h1> Air</h1>
              <Chart
                chartType="area"
                color="#fff"
                data={sensorData}
                dataKey="Air"
              />
            </div>
            <div className="stat">
              <h1>Fire</h1>
              <ChartPie data={fireData} />
            </div>
            <div className="stat light">
              <h1>Light</h1>
              <Chart
                chartType="line"
                color="#fff"
                data={sensorData}
                dataKey="Light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [lng, setLng] = useState(-0.41551);
  const [lat, setLat] = useState(35.20779);
  return (
    <header>
      <div className="container">
        <h1>Fire Detection</h1>
        <ul>
          <li className="sensor-name">sensor 1</li>
          <li>
            lat: {lat} | lng: {lng}{" "}
          </li>
        </ul>
      </div>
    </header>
  );
}

function Map() {
  const [viewport, setViewport] = useState({
    longitude: -0.41551,
    latitude: 35.20779,
    zoom: 11,
  });
  const handleViewportChange = (newViewport) => {
    let { latitude, longitude, zoom } = newViewport;
    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);
    zoom = zoom.toFixed(5);
    setViewport({ latitude, longitude, zoom });
    console.log({ latitude, longitude, zoom });
  };
  return (
    <div className="map">
      <div className="cont-map">
        <MapGl
          mapboxAccessToken={accessToken}
          initialViewState={viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          onMove={(event) => handleViewportChange(event.viewState)}
          interactive={false}
        >
          <Marker
            longitude={-0.41551}
            latitude={35.20779}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <span className="sensor-position">1</span>
          </Marker>
          <Marker
            longitude={-0.42}
            latitude={35.2}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <span className="sensor-position">2</span>
          </Marker>
        </MapGl>
      </div>
      <div className="details">
        <h2>sensor postions</h2>
        <ul>
          <li className="position">
            <span className="sensor-position">1</span> 02-02-2024 || 15-02-2024
          </li>
          <li className="position">
            <span className="sensor-position">2</span> 15-02-2024 || now
          </li>
        </ul>
      </div>
    </div>
  );
}

function Chart({ chartType, color, data, dataKey }) {
  if (chartType == "line")
    return (
      <LineChart width={300} height={120} data={data}>
        <XAxis dataKey="createdAt" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} />
      </LineChart>
    );
  else if (chartType == "area")
    return (
      <AreaChart width={300} height={120} data={data}>
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
        <XAxis dataKey="createdAt" />
        <YAxis />
        <Tooltip />
      </AreaChart>
    );
}

function ChartPie({ data }) {
  const COLORS = ["#ea4d26a6", "#149DE0"]; // Colors for true and false

  return (
    <BarChart width={350} height={120} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" hide />
      <YAxis hide />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );
}

// get data form createdAt
function getDate(time) {
  const date = new Date(time);

  // Extract individual date components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

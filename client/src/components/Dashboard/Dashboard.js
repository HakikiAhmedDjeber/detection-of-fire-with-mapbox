import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MapGl, { Marker } from "react-map-gl";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
import { GET_ALL_DATA, GET_ONLYIDs, GET_Average } from "../../GraphQL/queries";
import "./dashboard.css";
const accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

const fireData = [
  { label: "Fire", value: 1 },
  { label: "No-fire", value: 19 },
];
let time = 10000000;
const MySwal = withReactContent(Swal);
export default function Dashboard() {
  const [averageData, setAverageData] = useState([]);
  const [allSensorsIds, setAllSensorsIds] = useState([]);
  const [sensorsNb, setSensorNb] = useState(0);

  function handleAverageData(newData) {
    setAverageData((prevData) => [...prevData, newData]);
  }

  const [
    getAverage,
    {
      loading: isLoadingAverage,
      data: responseAverageData,
      error: queryErrorAverage,
    },
  ] = useLazyQuery(GET_Average);
  useEffect(() => {
    if (!isLoadingAverage) {
      if (queryErrorAverage) {
        console.log(queryErrorAverage);
      }
      if (responseAverageData) {
        console.log(
          "Recieved Data by time ==> ",
          responseAverageData.GetDataAverage
        );
        setSensorNb(responseAverageData?.GetDataAverage?.Count);
        handleAverageData(responseAverageData.GetDataAverage);
        console.log(
          "data from use effect : ",
          responseAverageData.GetDataAverage
        );
      }
    }
  }, [isLoadingAverage, responseAverageData]);
  //  ADD new this will fetch allll historic
  // send the query
  useEffect(() => {
    // Schedule fetching every 5 seconds
    const intervalId = setInterval(() => {
      console.log("average data from interval", averageData);
      getAverage({ variables: { secondsValue: 1000000 } });
    }, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  // useEffect(() => {

  // }, [responseAverageData]);

  return (
    <div className="main-dashboard">
      <Header />
      <div className="main">
        <div className="container">
          <ul className="regions-sensors">
            <Regions />
            <li className="sensors">
              <div className="sensors-nb">
                <p className="regions-number">{sensorsNb}</p>
                <h2>Sensors</h2>
              </div>
              <div className="min">
                <h2>Min</h2>
                <span>-</span>
              </div>
              <div className="max">
                <h2>Max</h2>
                <span>-</span>
              </div>
            </li>
          </ul>
          <div className="map">
            <Map />
          </div>
          <DashChart sensorData={averageData} />
          <div className="notifications">
            <div className="header">
              <h2>Notifications</h2>
              <img src="./next.png" width={30} height={30} alt="next" />
            </div>
            <ul>
              <li className="notification">
                <img src="./fire.png" width={30} height={30} alt="fire" />
                <p>10:22:25</p>
                <p>sensor 2</p>
              </li>
              <li className="notification">
                <img src="./fire.png" width={30} height={30} alt="fire" />
                <p>10:22:25</p>
                <p>sensor 1</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [time, setTime] = useState(clock());
  function clock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(clock());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Fire Detection</h1>
        </Link>
        <p className="clock">{time}</p>
        {/* <ul>
          <li className="sensor-name">sensor {id}</li>
          <li>
            lat: {lat} | lng: {lng}{" "}
          </li>
        </ul> */}
      </div>
    </header>
  );
}
// chart component
function DashChart({ sensorData }) {
  const [select, setSelect] = useState("TemperatureAvg");
  function handleSelect(value) {
    console.log("the value of select", value);
    setSelect(value);
  }
  return (
    <div className="dashboard-chart">
      <div className="dashboard-stat">
        <div className="header">
          <h1>{select}</h1>
          <select
            className="select"
            value={select}
            onChange={(event) => handleSelect(event.target.value)}
          >
            <option value="TemperatureAvg">Temperature</option>
            <option value="GasAvg">Gas</option>
            <option value="HumidityAvg">Humidity</option>
            <option value="AirAvg">Air</option>
            <option value="LightAvg">Light</option>
          </select>
        </div>
        <Chart
          chartType="area"
          color="#ea4d26a6"
          data={sensorData}
          dataKey={select}
        />
      </div>
    </div>
  );
}
// map components
function Map() {
  const [viewport, setViewport] = useState({
    longitude: -0.41551,
    latitude: 35.20779,
    zoom: 10,
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
        <span className="sensor-position"></span>
      </Marker>
    </MapGl>
  );
}
// Regions components
function Regions() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  function handlePopup() {
    setIsPopupOpen(!isPopupOpen);
    isPopupOpen &&
      MySwal.fire({
        title: <h1>Regions List :</h1>,
        html: <RegionsList />,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
        confirmButtonText: "Go",
      }).then(() => {
        window.location.href = "/map";
      });
  }
  return (
    <>
      <li className="regions" onClick={handlePopup}>
        <p className="regions-number">01</p>
        <div className="title">
          <img src="./location.png" width={30} height={30} alt="location" />
          <h2>coverage regions</h2>
        </div>
        <img src="./next.png" width={30} height={30} alt="next" />
      </li>
    </>
  );
}
function Chart({ chartType, color, data, dataKey }) {
  return (
    <AreaChart width={600} height={200} data={data}>
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke="#8884d8"
        fill="url(#colorUv)"
      />
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="createdAt" />
      <YAxis />
      <Tooltip />
    </AreaChart>
  );
}

function Filter({ handleFilterDate, filterDate }) {
  return (
    <div>
      <input
        style={{ float: "right" }}
        type="date"
        id="dateInput"
        name="dateInput"
        onChange={handleFilterDate}
        value={filterDate}
      />
    </div>
  );
}

// get data form createdAt
function getDate() {
  const date = new Date();

  // Extract individual date components
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1); // Months are zero-based, so add 1
  const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date string
  return `${year}-${month}-${day}`;
}

// function form date to time
function dateToTime(dateString) {
  const parts = dateString.split("-");

  // Extract year, month, and day from the parts array
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Months are 0-indexed
  const day = parseInt(parts[2]);

  // Create the Date object
  return new Date(year, month, day).getTime();
}

function RegionsList() {
  return (
    <ul>
      <li>
        <h1>region : sidi bel abbes</h1>
      </li>
    </ul>
  );
}

// Define a custom comparison function based on the id property
const uniqueById = (array) => {
  const seen = new Set();
  return array.filter((obj) => {
    if (!seen.has(obj.id)) {
      seen.add(obj.id);
      return true;
    }
    return false;
  });
};

import { useState, useEffect } from "react";

const sensors = [
  { latitude: 35.20779, longitude: -0.41551 },
  { latitude: 35.2078, longitude: -0.405 },
  { latitude: 35.2, longitude: -0.4155 },
  { latitude: 35.2, longitude: -0.405 },
];
// const sensors = [
//   {
//     longitude: -0.41551,
//     latitude: 35.20779,
//   },
// ];
export default function Sidebar({ region, selectSensor, allSensors }) {
  const [time, setTime] = useState(clock());
  const [openSensor, SetOpenSensor] = useState([]);
  function clock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  // handle click sensor
  function HandleClickSensor(device) {
    SetOpenSensor(device);
    selectSensor({
      latitude: device?.location.latitude || 0,
      longitude: device?.location.longitude || 0,
      zoom: 12,
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(clock());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="sidebar">
      <h2 className="logo">Fire Detection</h2>
      <p className="clock">{time}</p>
      <p className="region">{region}</p>
      <h2 className="on-sensors">Active Sensors</h2>
      <ul className="sensors">
        {allSensors.map((sensor, i) => {
          return (
            <li
              className={sensor.id === openSensor.id ? "selected" : ""}
              onClick={() => HandleClickSensor(sensor)}
            >
              <img src="./sensor.png" width={20} />
              <p>sensor {sensor.id}</p>
            </li>
          );
        })}
      </ul>
      <h2 className="on-sensors">Off Sensors</h2>
      <ul className="sensors">
        <li>
          <img src="./sensor.png" width={20} />
          <p>sensor 2</p>
        </li>
      </ul>
    </div>
  );
}

import { useState, useEffect } from "react";

const sensors = [
  {
    longitude: -0.41551,
    latitude: 35.20779,
  },
];
export default function Sidebar({ region, selectSensor }) {
  const [time, setTime] = useState(clock());

  function clock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  // handle click sensor
  function HandleClickSensor(coordinates) {
    selectSensor({ ...coordinates, zoom: 11 });
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
      <ul className="sensors">
        <li className="selected" onClick={() => HandleClickSensor(sensors[0])}>
          <img src="./sensor.png" width={20} />
          <p>sensor 1</p>
        </li>
        <li>
          <img src="./sensor.png" width={20} />
          <p>sensor 2</p>
        </li>
        <li>
          <img src="./sensor.png" width={20} />
          <p>sensor 3</p>
        </li>
        <li>
          <img src="./sensor.png" width={20} />
          <p>sensor 4</p>
        </li>
      </ul>
    </div>
  );
}

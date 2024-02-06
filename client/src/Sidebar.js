import { useState, useEffect } from "react";

export default function Sidebar() {
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
    <div className="sidebar">
      <h2 className="logo">Fire Detection</h2>
      <p className="clock">{time}</p>
      <p>region</p>
      <ul className="sensors">
        <li className="selected">
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

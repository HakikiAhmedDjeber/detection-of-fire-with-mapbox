import { useRef, useState } from "react";
import { Marker, Popup } from "react-map-gl";
export default function Point({
  lng,
  lat,
  handleChart,
  sensorData,
  id,
  onSensorId,
}) {
  const marker = useRef(null);
  const popup = useRef(<Popup />);

  const [openPopup, setOpenPopup] = useState(false);

  const handleClick = () => {
    setOpenPopup(!openPopup);
  };

  return (
    <Marker
      ref={marker}
      longitude={lng}
      latitude={lat}
      offsetLeft={-20}
      offsetTop={-10}
      onClick={handleClick}
    >
      <img src="./sensor.png" width={30} height={30} />

      {openPopup && (
        <Popup
          ref={popup}
          latitude={lat}
          longitude={lng}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setOpenPopup(false)}
        >
          {!sensorData ? (
            <SensorPopup
              handleChart={handleChart}
              id={id}
              onSensorId={onSensorId}
            />
          ) : (
            <SensorPopup
              lat={sensorData.location.latitude}
              lng={sensorData.location.longitude}
              temp={sensorData.data.Temperature}
              gas={sensorData.data.Gas}
              hum={sensorData.data.Humidity}
              handleChart={handleChart}
              id={id}
              onSensorId={onSensorId}
            />
          )}
        </Popup>
      )}
    </Marker>
  );
}

function SensorPopup({
  lat = 0,
  lng = 0,
  temp = 0,
  gas = 0,
  hum = 0,
  handleChart,
  id,
  onSensorId,
}) {
  return (
    <div className="popup">
      <div className="location">
        <span id="lat">
          <b>Lat : </b>
          {lat}
        </span>
        <span>||</span>
        <span id="lng">
          <b>Lang : </b> {lng}
        </span>
      </div>
      <ul className="data">
        <li>
          <h4>Temp</h4>
          <p>{temp}</p>
        </li>
        <li>
          <h4>Gas</h4>
          <p>{gas}</p>
        </li>
        <li>
          <h4>Hum</h4>
          <p>{hum}</p>
        </li>
      </ul>
      <span
        className="showChart"
        onClick={() => {
          handleChart();
          onSensorId(id + 1);
        }}
      >
        show chart
      </span>
    </div>
  );
}

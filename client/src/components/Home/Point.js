import { useRef, useState, useEffect } from "react";
import { Marker, Popup } from "react-map-gl";
import Sound from "react-sound";
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
      {sensorData ? (
        sensorData.data.Fire == 1 ? (
          <>
            <img
              src="./fire.png"
              width={30}
              height={30}
              className="fire-icon"
            />
            <SoundPlayer />
          </>
        ) : (
          <img src="./sensor.png" width={30} height={30} />
        )
      ) : (
        <img src="./sensor.png" width={30} height={30} />
      )}

      {openPopup && (
        <Popup
          className={`${sensorData?.data.Fire == 1 ? "fire-popup" : ""}`}
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
              fire={sensorData.data.Fire}
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
  fire = 0,
  handleChart,
  id,
  onSensorId,
}) {
  return (
    <div className={`popup ${fire ? "fire" : ""}`}>
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
          onSensorId(+id.id);
        }}
      >
        show chart
      </span>
    </div>
  );
}

// const SoundPlayer = () => {
//   const [isPlaying, setIsPlaying] = useState(true);

//   // const togglePlay = () => {
//   //   setIsPlaying(!isPlaying);
//   // };

//   return (
//     <div>
//       <Sound
//         url="./fire.mp3"
//         autoLoad={true} // Enable auto-loading
//         playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
//         loop={true} // Enable looping
//         onFinishedPlaying={() => setIsPlaying(false)}
//       />
//     </div>
//   );
// };

const SoundPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Function to handle automatic playback
    const handleAutoPlay = () => {
      setIsPlaying(true);
      document.removeEventListener("click", handleAutoPlay);
    };

    // Add event listener for user interaction (click)
    document.addEventListener("click", handleAutoPlay);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("click", handleAutoPlay);
    };
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <div>
      <Sound
        url="./fire.mp3"
        autoLoad={true}
        loop={true}
        playStatus={isPlaying ? Sound.status.PLAYING : Sound.status.PAUSED}
        onFinishedPlaying={() => setIsPlaying(false)}
      />
    </div>
  );
};

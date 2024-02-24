import React, { useRef, useEffect, useState } from "react";
import MapGl, { Layer, Feature } from "react-map-gl";
import axios from "axios";
import Point from "./Point";
const accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

export default function Map({
  setRegionName,
  viewport,
  setViewport,
  handleChart,
  onSensorId,
  allSensors,
}) {
  const map = useRef(null);
  const [sensorData, SetSensorData] = useState([null, null]);
  const [lng, setLng] = useState(-0.41551);
  const [lat, setLat] = useState(35.20779);
  const [zoom, setZoom] = useState(9);
  const [isSensorOpen, setIsSensorOpen] = useState(true);

  const [openPopup, setOpenPopup] = useState(false);

  const handleClick = () => {
    setOpenPopup(!openPopup);
  };

  useEffect(() => {
    // Function to fetch region name based on coordinates
    const fetchRegionName = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
        );
        if (response.data && response.data.features.length > 0) {
          const firstFeature = response.data.features[1];
          setRegionName(firstFeature.place_name);
        }
      } catch (error) {
        console.error("Error fetching region name:", error);
      }
    };

    // Fetch region name when viewport changes
    fetchRegionName(viewport.latitude, viewport.longitude);
  }, [viewport, accessToken, setRegionName]);
  // change the viewport data
  const handleViewportChange = (newViewport) => {
    let { latitude, longitude, zoom } = newViewport;
    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);
    zoom = zoom.toFixed(5);
    setViewport({ latitude, longitude, zoom });
    console.log({ latitude, longitude, zoom });
  };

  const markers = [
    { lat: lat, lng: lng },
    { lat: 35.2078, lng: -0.405 },
    { lat: 35.2, lng: -0.4155 },
    { lat: 35.2, lng: -0.405 },
  ];

  useEffect(() => {
    setInterval(() => {
      SetSensorData([
        {
          id: "1",
          location: {
            longitude: -0.41551,
            latitude: 35.20779,
          },
          data: {
            Temperature: Math.floor(Math.random() * (24 - 18 + 1)) + 18,
            Humidity: Math.floor(Math.random() * (80 - 60 + 1)) + 60,
            Gas: Math.floor(Math.random() * (35 - 20 + 1)) + 20,
            Fire: 1,
            Light: 240,
          },
        },
        {
          id: "3",
          location: {
            longitude: -0.41551,
            latitude: 35.20779,
          },
          data: {
            Temperature: Math.floor(Math.random() * (24 - 18 + 1)) + 18,
            Humidity: Math.floor(Math.random() * (80 - 60 + 1)) + 60,
            Gas: Math.floor(Math.random() * (35 - 20 + 1)) + 20,
            Fire: 0,
            Light: 240,
          },
        },
      ]);
    }, 5000);
  }, []);

  return (
    <div className="map">
      <div className="map-info">
        Longitude: {viewport.longitude} | Latitude: {viewport.latitude} | Zoom:{" "}
        {viewport.zoom}
        {/* <NavigateButton setViewport={setViewport} /> */}
      </div>
      <div className="map-container">
        <MapGl
          ref={map}
          mapboxAccessToken={accessToken}
          viewState={viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          onMove={(event) => handleViewportChange(event.viewState)}
        >
          {allSensors.map((ele, i) => {
            return (
              <Point
                lng={ele.location.longitude}
                lat={ele.location.latitude}
                handleChart={handleChart}
                sensorData={sensorData[i]}
                onSensorId={onSensorId}
                id={sensorData[i]}
                key={i}
              />
            );
          })}
        </MapGl>
      </div>
    </div>
  );
}

// function NavigateButton({ setViewport }) {
//   // change the viewport data
//   const handleViewportChange = () => {
//     setViewport({ longitude: 42, latitude: 20, zoom: 9 });
//   };
//   const { current: map } = useMap();

//   const onClick = () => {
//     handleViewportChange();
//   };

//   return <button onClick={onClick}>Go</button>;
// }

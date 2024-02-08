import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapGl, { Marker, Popup, useMap } from "react-map-gl";
import axios from "axios";

const accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

export default function Map({
  sensorData,
  setRegionName,
  viewport,
  setViewport,
  handleChart,
}) {
  const marker = useRef(null);
  const popup = useRef(<Popup />);
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

  return (
    <div className="map">
      <div className="map-info">
        Longitude: {viewport.longitude} | Latitude: {viewport.latitude} | Zoom:{" "}
        {viewport.zoom}
      </div>
      <div className="map-container">
        <MapGl
          id="myMap"
          mapboxAccessToken={accessToken}
          initialViewState={viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          onMove={(event) => handleViewportChange(event.viewState)}
        >
          <Marker
            ref={marker}
            longitude={lng}
            latitude={lat}
            offsetLeft={-20}
            offsetTop={-10}
            // draggable
            // onDragEnd={(event) => {
            //   setLng(event.lngLat[0]);
            //   setLat(event.lngLat[1]);
            // }}
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
                  <SensorPopup handleChart={handleChart} />
                ) : (
                  <SensorPopup
                    lat={sensorData.location.latitude}
                    lng={sensorData.location.longitude}
                    temp={sensorData.data.Temperature}
                    gas={sensorData.data.Gas}
                    air={sensorData.data.Air}
                    handleChart={handleChart}
                  />
                )}
              </Popup>
            )}
          </Marker>
        </MapGl>
      </div>
    </div>
  );
}

function SensorPopup({
  lat = 0,
  lng = 0,
  temp = 0,
  gas = 0,
  air = 0,
  handleChart,
}) {
  return (
    <div className="popup">
      <div className="location">
        <span id="lat">
          <b>Lat : </b>
          {lat}
        </span>
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
          <h4>Air</h4>
          <p>{air}</p>
        </li>
      </ul>
      <span className="showChart" onClick={() => handleChart()}>
        show chart
      </span>
    </div>
  );
}

// use effect with mapbox-gl
// useEffect(() => {
//   if (!map.current) {
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [lng, lat],
//       zoom: zoom,
//     });

//     map.current.on("move", () => {
//       setLng(map.current.getCenter()?.lng.toFixed(6));
//       setLat(map.current.getCenter()?.lat.toFixed(6));
//       setZoom(map.current.getZoom()?.toFixed(2));
//     });

//     map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
//   }

//   if (sensorData && sensorData.location) {
//     const {
//       location: { longitude, latitude } = {},
//       data: { Temperature, Gas, Air } = {},
//     } = sensorData;

//     if (!marker.current) {
//       const customMarker = document.createElement("div");
//       customMarker.className = "custom-marker";
//       customMarker.style.backgroundImage = "url('/sensor.png')";
//       // customMarker.style.backgroundColor = "#000";
//       customMarker.style.width = "30px";
//       customMarker.style.height = "30px";
//       customMarker.style.backgroundSize = "100%";

//       marker.current = new mapboxgl.Marker({
//         element: customMarker,
//         draggable: true,
//       })
//         .setLngLat([longitude, latitude])
//         .setPopup(popup.current)
//         .addTo(map.current);
//     }

//     marker.current.setLngLat([longitude, latitude]);

//     popup.current.setHTML(
//       isSensorOpen
//         ? sensorPopup(longitude, latitude, Temperature, Gas, Air)
//         : `<div>sensor is off</div>`
//     );
//   }
// }, [sensorData]);

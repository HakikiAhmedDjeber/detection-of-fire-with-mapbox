import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

export default function Map({ sensorData }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(new mapboxgl.Popup());
  const [lng, setLng] = useState(-0.41551);
  const [lat, setLat] = useState(35.20779);
  const [zoom, setZoom] = useState(9);
  const [isSensorOpen, setIsSensorOpen] = useState(true);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.on("move", () => {
        setLng(map.current.getCenter()?.lng.toFixed(6));
        setLat(map.current.getCenter()?.lat.toFixed(6));
        setZoom(map.current.getZoom()?.toFixed(2));
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    if (sensorData && sensorData.location) {
      const {
        location: { longitude, latitude } = {},
        data: { Temperature, Gas, Air } = {},
      } = sensorData;

      if (!marker.current) {
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([longitude, latitude])
          .setPopup(popup.current)
          .addTo(map.current);
      }

      marker.current.setLngLat([longitude, latitude]);

      popup.current.setHTML(
        isSensorOpen
          ? sensorPopup(longitude, latitude, Temperature, Gas, Air)
          : `<div>sensor is off</div>`
      );
    }
  }, [sensorData]);
  return (
    <div className="map">
      <div className="map-info">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

function sensorPopup(lng = 0, lat = 0, temp = 0, gas = 0, air = 0) {
  return `
    <div class="popup">
      <div class="location">
        <span id="lat"><b>Lat : </b>${lat}</span>
        <span id="lng"><b>Lang : </b> ${lng}</span>
      </div>
      <ul class="data">
        <li>
          <h4>Temp</h4>
          <p>${temp}</p>
        </li>
        <li>
          <h4>Gas</h4>
          <p>${gas}</p>
        </li>
        <li>
          <h4>Air</h4>
          <p>${air}</p>
        </li>
      </ul>
    </div>`;
}

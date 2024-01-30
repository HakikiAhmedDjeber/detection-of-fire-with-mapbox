import React, { useRef, useEffect, useState } from "react";
// import the map
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// the api Key
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2VyaGFuZW91c3NhbWEiLCJhIjoiY2xyejZ0OTF0MXE4dTJqcGJ2cWdtbWlzMyJ9.C0wZ14hebIIQrApUkF6uQQ";

//component
export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-0.41551);
  const [lat, setLat] = useState(35.20779);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    // Add our navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current); // add the marker to the map
  });
  return (
    <div className="map">
      <div className="map-info">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

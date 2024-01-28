import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";

function App() {
  return (
    <div className="App">
      <MapContainer
        center={[35.2, -0.641389]}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[35.2, -0.641389]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[35.2, -0.641389]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[35.2, -0.641389]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[35.2, -0.641389]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
let DefaultIcon = L.icon({
  iconUrl: "sensor.png",
  iconSize: [20, 20],
});
console.log(L.marker);
L.Marker.prototype.options.icon = DefaultIcon;
export default App;

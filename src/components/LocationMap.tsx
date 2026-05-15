import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  name: string;
};

export default function LocationMap({ latitude, longitude, name }: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      className="h-full w-full flex-1 rounded-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}

import "leaflet/dist/leaflet.css";
import type { Location } from "../types/location";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import markerRed from "../assets/map/marker-red.png";
import markerBlue from "../assets/map/marker-blue.png";

type MapEventHandlerProps = {
  onChange: (bounds: L.LatLngBounds) => void;
};

function MapEventHandler({ onChange }: MapEventHandlerProps) {
  const map = useMap();

  useEffect(() => {
    onChange(map.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    moveend: (e) => onChange(e.target.getBounds()),
    zoomend: (e) => onChange(e.target.getBounds()),
  });

  return null;
}

// # Map Component
const redPinIcon = new L.Icon({
  iconUrl: markerRed,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const bluePinIcon = new L.Icon({
  iconUrl: markerBlue,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type ExploreMapProps = {
  locationMarkers?: (Location & { isSearchResult?: boolean })[];
  onChange: (bounds: L.LatLngBounds) => void;
};

export default function ExploreMap({ locationMarkers, onChange }: ExploreMapProps) {
  return (
    <MapContainer
      center={[48.866667, 2.333333]}
      zoom={5}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <ZoomControl position="topright" />
      <MapEventHandler onChange={onChange} />

      {locationMarkers?.map((loc) => (
        <Marker
          position={[loc.latitude, loc.longitude]}
          key={loc.id}
          icon={loc.isSearchResult ? redPinIcon : bluePinIcon}
        >
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

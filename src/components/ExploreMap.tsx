import "leaflet/dist/leaflet.css";
import type { Location } from "../types/location";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
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
  onClick: () => void;
};

function MapEventHandler({ onChange, onClick }: MapEventHandlerProps) {
  const map = useMap();

  useEffect(() => {
    onChange(map.getBounds());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMapEvents({
    moveend: (e) => onChange(e.target.getBounds()),
    zoomend: (e) => onChange(e.target.getBounds()),
    click: () => onClick(),
  });

  return null;
}

// # Map Component
const redPinIcon = new L.Icon({
  iconUrl: markerRed,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  // popupAnchor: [0, -30],
});
const bluePinIcon = new L.Icon({
  iconUrl: markerBlue,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  // popupAnchor: [0, -30],
});
const selectedPinIcon = new L.Icon({
  iconUrl: markerRed,
  iconSize: [35, 57],
  iconAnchor: [18, 57],
  // popupAnchor: [0, -42],
});

type ExploreMapProps = {
  locationMarkers?: (Location & { isSearchResult?: boolean })[];
  selectedLocation?: Location;
  onChange: (bounds: L.LatLngBounds) => void;
  onLocationSelect: (location: Location) => void;
  onLocationClose: () => void;
};

export default function ExploreMap({
  locationMarkers,
  selectedLocation,
  onChange,
  onLocationSelect,
  onLocationClose,
}: ExploreMapProps) {
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
      <MapEventHandler onChange={onChange} onClick={onLocationClose} />

      {locationMarkers?.map((loc) => {
        const iconToShow =
          loc.id == selectedLocation?.id
            ? selectedPinIcon
            : loc.isSearchResult
              ? redPinIcon
              : bluePinIcon;

        return (
          <Marker
            position={[loc.latitude, loc.longitude]}
            key={loc.id}
            icon={iconToShow}
            eventHandlers={{
              click: () => onLocationSelect(loc),
            }}
          >
            {selectedLocation?.id === loc.id && (
              <Tooltip permanent direction="right" offset={[10, -25]} className="location-label">
                {loc.name}
              </Tooltip>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
}

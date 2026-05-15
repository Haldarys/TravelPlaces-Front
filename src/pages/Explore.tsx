import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Location } from "../types/location";
import ExploreMap from "../components/ExploreMap";
import { fetchLocationsByBounds, fetchLocationsBySearch } from "../api/locationApi";
import { useEffect, useState } from "react";
import L from "leaflet";
import FetchIndicator from "../components/ui/FetchIndicator";
import ExploreSidebar from "../components/ExploreSidebar";

export default function Explore() {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState(bounds);

  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedBounds(bounds);
    }, 1000);
    return () => clearTimeout(delay);
  }, [bounds]);

  const boundsLocations = useQuery<Location[]>({
    queryKey: ["locations", "bounds", debouncedBounds],
    queryFn: () => fetchLocationsByBounds(debouncedBounds as L.LatLngBounds),
    enabled: bounds !== null,
    placeholderData: keepPreviousData,
    initialData: [],
  });

  const searchedLocations = useQuery<Location[]>({
    queryKey: ["Locations", "search", currentSearch],
    queryFn: () => fetchLocationsBySearch({ name: currentSearch }),
    enabled: currentSearch != "",
    initialData: [],
  });

  const filteredBoundsLocations =
    boundsLocations.data?.filter(
      (vLoc) => !searchedLocations.data?.some((sLoc) => sLoc.id === vLoc.id),
    ) ?? [];

  const mapVisibleLocations = [
    ...filteredBoundsLocations,
    ...(searchedLocations.data?.map((loc) => ({ ...loc, isSearchResult: true })) ?? []),
  ];

  const sidebarVisibleLocations = currentSearch ? searchedLocations.data : boundsLocations.data;

  function handleMapChange(bounds: L.LatLngBounds) {
    setBounds(bounds);
  }

  function onLocationSelect(location: Location) {
    setSelectedLocation(location);
    console.log(location.name);
  }

  function onLocationClose() {
    setSelectedLocation(undefined);
  }

  return (
    <div className="relative h-full">
      {/* Map */}
      <div className="absolute inset-0">
        <ExploreMap locationMarkers={mapVisibleLocations} onChange={handleMapChange} />
      </div>

      {/* Left Panel */}
      <ExploreSidebar
        locations={sidebarVisibleLocations}
        selectedLocation={selectedLocation}
        onSearch={(value) => {
          setCurrentSearch(value);
        }}
        onLocationSelect={onLocationSelect}
        onLocationClose={onLocationClose}
      />

      <div className="absolute bottom-10 right-10 z-1000">
        <FetchIndicator isPending={boundsLocations.isPending} error={boundsLocations.error} />
      </div>
    </div>
  );
}

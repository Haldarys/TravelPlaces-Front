import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Location, LocationFormData } from "../types/location";
import ExploreMap from "../components/ExploreMap";
import {
  fetchLocationById,
  fetchLocationsByBounds,
  fetchLocationsBySearch,
  updateLocation,
} from "../api/locationApi";
import { useEffect, useState } from "react";
import L from "leaflet";
import FetchIndicator from "../components/ui/FetchIndicator";
import ExploreSidebar from "../components/ExploreSidebar";
import Modal from "../components/Modal";
import LocationForm from "../components/LocationForm";
import LocationImagesManager from "../components/LocationImagesManager";

export default function Explore() {
  const queryClient = useQueryClient();

  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState(bounds);

  const [currentSearch, setCurrentSearch] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: LocationFormData) => updateLocation(selectedLocation.data!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setIsEditModalOpen(false);
    },
  });

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
    queryKey: ["locations", "search", currentSearch],
    queryFn: () => fetchLocationsBySearch({ name: currentSearch }),
    enabled: currentSearch != "",
    initialData: [],
  });

  const selectedLocation = useQuery<Location>({
    queryKey: ["locations", "location", selectedLocationId],
    queryFn: () => fetchLocationById(selectedLocationId!),
    enabled: selectedLocationId !== null,
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
    setSelectedLocationId(location.id);
  }

  function onLocationClose() {
    setSelectedLocationId(0);
  }

  function onLocationEdit() {
    setIsEditModalOpen(true);
  }

  function handleSubmitLocationEdit(submitData: LocationFormData) {
    mutation.mutate(submitData);
  }

  return (
    <div className="relative h-full">
      {/* Map */}
      <div className="absolute inset-0">
        <ExploreMap
          locationMarkers={mapVisibleLocations}
          selectedLocation={selectedLocation.data}
          onChange={handleMapChange}
          onLocationSelect={onLocationSelect}
          onLocationClose={onLocationClose}
        />
      </div>

      <div className="absolute z-1000 s max-sm:top-4 max-sm:left-4 sm:top sm:bottom-10 sm:right-10">
        <FetchIndicator isPending={boundsLocations.isFetching} error={boundsLocations.error} />
      </div>

      {/* Left Panel */}
      <ExploreSidebar
        locations={sidebarVisibleLocations}
        selectedLocation={selectedLocation.data}
        onSearch={(value) => {
          setCurrentSearch(value);
        }}
        onLocationSelect={onLocationSelect}
        onLocationClose={onLocationClose}
        onLocationEdit={onLocationEdit}
      />

      {selectedLocation.data && isEditModalOpen && (
        <Modal
          onClose={() => {
            setIsEditModalOpen(false);
          }}
        >
          <h1>{selectedLocation.data.name}</h1>
          <LocationImagesManager
            locationId={selectedLocation.data.id}
            images={selectedLocation.data.images}
          />
          <LocationForm
            initialData={selectedLocation.data}
            onSubmit={handleSubmitLocationEdit}
            isPending={mutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

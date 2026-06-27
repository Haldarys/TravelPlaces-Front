import { useEffect, useState } from "react";
import type { Location } from "../types/location";
import LocationCard from "./LocationCard";
import LocationPreview from "./LocationPreview";
import clsx from "clsx";
import { CaretDownIcon, CaretUpIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

type ExploreSidebarProps = {
  locations: Location[];
  selectedLocation?: Location;
  onSearch: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  onLocationClose: () => void;
  onLocationEdit: () => void;
};

export default function ExploreSidebar({
  locations,
  selectedLocation,
  onSearch,
  onLocationSelect,
  onLocationClose,
  onLocationEdit,
}: ExploreSidebarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (selectedLocation) setIsSidebarOpen(true);
  }, [selectedLocation]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 bg-white/80 z-1000 rounded-t-3xl overflow-y-auto transition-all duration-200",
        "sm:absolute sm:top-6 sm:left-6 sm:bottom-6 sm:w-80 sm:rounded-md sm:h-auto",
        { "sm:w-120": selectedLocation },
        { "h-24": !isSidebarOpen },
        { "h-1/2": isSidebarOpen || selectedLocation },
      )}
    >
      {selectedLocation ? (
        <LocationPreview
          location={selectedLocation}
          onClose={onLocationClose}
          onEdit={onLocationEdit}
        />
      ) : (
        <div>
          {/* Search */}
          <div className="pt-3 px-3">
            <div className="flex mb-2">
              <div className="relative grow">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && onSearch(searchInput)}
                  onFocus={() => setIsSidebarOpen(true)}
                  placeholder="Rechercher..."
                  className="mb-0"
                />
                <button
                  onClick={() => onSearch(searchInput)}
                  className="absolute top-0 bottom-0 right-2 text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <MagnifyingGlassIcon size={20} />
                </button>
              </div>
              <button className="sm:hidden ml-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <CaretDownIcon /> : <CaretUpIcon />}
              </button>
            </div>

            <span className="px-1 text-xs text-slate-600">{locations?.length ?? 0} Résultats</span>
          </div>

          {/* List */}
          <div
            className={clsx("flex-1 overflow-y-auto p-3 flex flex-col gap-2", {
              "hidden sm:flex": !isSidebarOpen,
            })}
          >
            {locations?.map((location: Location) => (
              <LocationCard
                location={location}
                key={location.id}
                onClick={() => onLocationSelect(location)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

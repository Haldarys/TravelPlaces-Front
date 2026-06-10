import { useState } from "react";
import type { Location } from "../types/location";
import LocationCard from "./LocationCard";
import LocationPreview from "./LocationPreview";
import clsx from "clsx";

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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 bg-white/80 z-1000 rounded-t-md overflow-y-auto transition-all duration-200",
        "sm:absolute sm:top-6 sm:left-6 sm:bottom-6 sm:w-80 sm:rounded-md sm:h-auto",
        { "sm:w-120": selectedLocation },
        { "h-24": !isSidebarOpen },
        { "h-1/2": isSidebarOpen },
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                  </svg>
                </button>
              </div>
              <button className="sm:hidden ml-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? "▼" : "▲"}
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

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
};

export default function ExploreSidebar({
  locations,
  selectedLocation,
  onSearch,
  onLocationSelect,
  onLocationClose,
}: ExploreSidebarProps) {
  const [searchInput, setSearchInput] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  return (
    <div
      className={clsx(
        "absolute top-6 left-6 bottom-6 w-80 rounded-md bg-white/80 z-1000 overflow-y-auto transition-all duration-200",
        { "w-120": selectedLocation },
      )}
    >
      {selectedLocation ? (
        <LocationPreview location={selectedLocation} onClose={onLocationClose} />
      ) : (
        <div>
          {/* Search */}
          <div className="pt-3 px-3">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && onSearch(searchInput)}
                placeholder="Rechercher..."
                className="w-full"
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
            <span className="px-1 text-xs text-slate-600">{locations?.length ?? 0} Résultats</span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
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

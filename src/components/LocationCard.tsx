import type { Location } from "../types/location";
import { getCountryName } from "../utils/Localization";

type Props = {
  location: Location;
  onClick?: () => void;
};

export default function LocationCard({ location, onClick }: Props) {
  return (
    <div
      className="relative h-40 rounded-md overflow-hidden shrink-0 cursor-pointer group"
      onClick={onClick}
    >
      {/* Background image */}
      <img
        src="https://picsum.photos/1280/720"
        alt={location.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-120"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 from-20% via-black/10 to-black/20" />

      {/* Top row */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
        <span className="text-xs font-medium bg-black/40 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
          {location.countryCode ? getCountryName(location.countryCode) : "-"}
        </span>
        <div className="flex gap-1">
          <button className="bg-black/40 text-white p-1 rounded-md backdrop-blur-xs hover:bg-black/60">
            {/* action 1 */}♡
          </button>
          <button className="bg-black/40 text-white p-1 rounded-md backdrop-blur-xs hover:bg-black/60">
            {/* action 2 */}↗
          </button>
        </div>
      </div>

      {/* Bottom row */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white font-semibold text-sm leading-tight">{location.name}</p>
        {location.description && (
          <p className="text-white/80 text-xs line-clamp-2 mt-0.5">{location.description}</p>
        )}
      </div>
    </div>
  );
}

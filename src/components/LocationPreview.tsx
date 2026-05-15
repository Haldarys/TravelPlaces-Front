import type { Location } from "../types/location";
import { getCountryName } from "../utils/Localization";

type Props = {
  location: Location;
  onClose: () => void;
};

const externalRefConfig: Record<string, { label: string; url: (id: string) => string }> = {
  google_place_id: {
    label: "Google Maps",
    url: (id) => `https://www.google.com/maps/place/?q=place_id:${id}`,
  },
  osm_node_id: {
    label: "OpenStreetMap",
    url: (id) => `https://www.openstreetmap.org/node/${id}`,
  },
  wikidata_id: {
    label: "Wikidata",
    url: (id) => `https://www.wikidata.org/wiki/${id}`,
  },
};

export default function LocationPreview({ location, onClose }: Props) {
  const googlePlaceId = location.externalRefs?.google_place_id;
  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Photo */}
      <div className="relative h-56 shrink-0">
        <img
          src="https://picsum.photos/seed/preview/800/400"
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/30" />

        {/* Top row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <button
            onClick={onClose}
            className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-1">
            <button className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </button>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Name + tags */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-white font-semibold text-lg leading-tight">{location.name}</h2>
          {location.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {location.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4">
        {/* Country + city */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {location.countryCode && <span>{getCountryName(location.countryCode)}</span>}
          {location.city && (
            <>
              <span>·</span>
              <span>{location.city}</span>
            </>
          )}
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-sm text-slate-700 leading-relaxed">{location.description}</p>
        )}

        {/* Address */}
        {location.address && <div className="text-sm text-slate-500">{location.address}</div>}

        {/* External refs */}
        {Object.keys(location.externalRefs ?? {}).length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <div className="text-xs font-medium text-slate-500 px-3 py-2 bg-slate-50 border-b">
              Références externes
            </div>
            {Object.entries(location.externalRefs).map(([key, value]) => {
              const config = externalRefConfig[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-2 text-sm border-b last:border-0"
                >
                  <span className="text-slate-600">{config?.label ?? key}</span>
                  {config ? (
                    <a
                      href={config.url(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-xs"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">{value}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

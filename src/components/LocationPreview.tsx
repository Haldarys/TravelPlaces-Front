import { useState } from "react";
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
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const visibleTags = tagsExpanded ? location.tags : location.tags.slice(0, 3);

  const googlePlaceId = location.externalRefs?.google_place_id;
  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Photo */}
      <div className="relative h-56 shrink-0">
        <img
          src="https://picsum.photos/1280/720"
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 from-20% via-black/10 to-black/30" />

        {/* Top row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <button
            onClick={onClose}
            className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60"
          >
            ⏴
          </button>
          <div className="flex gap-1">
            <button className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60">
              ♡
            </button>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-black/60"
              >
                ↗
              </a>
            )}
          </div>
        </div>

        {/* Name + tags */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-white font-semibold text-lg leading-tight">{location.name}</h2>
          <div className="flex flex-wrap gap-1 mt-1 max-h-25 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-white/50">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {location.tags.length > 3 && (
              <button
                onClick={() => setTagsExpanded((current) => !current)}
                className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm hover:bg-white/30"
              >
                {tagsExpanded ? "Réduire" : `+${location.tags.length - 3}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-4">
        {/* Country + city */}
        {(location.countryCode || location.city) && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {location.countryCode && <span>{getCountryName(location.countryCode)}</span>}
            {location.countryCode && location.city && <span>·</span>}
            {location.city && <span>{location.city}</span>}
          </div>
        )}

        {/* Description */}
        {location.description && (
          <p className="text-sm text-slate-700 leading-relaxed">{location.description}</p>
        )}

        {/* Address */}
        {location.address && <div className="text-sm text-slate-500">{location.address}</div>}

        {/* External refs */}
        {Object.keys(location.externalRefs ?? {}).length > 0 && (
          <div className="text-sm border border-slate-200 divide-y divide-slate-200 rounded-md overflow-hidden">
            <div className=" font-medium text-slate-500 px-3 py-2 bg-white">
              Références externes
            </div>
            {Object.entries(location.externalRefs).map(([key, value]) => {
              const config = externalRefConfig[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-2 odd:bg-slate-50 even:bg-slate-100"
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

import type { Location } from "../types/location";

export default function LocationDetail({ location }: { location: Location }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Description", value: location.description ?? "-" },
    { label: "Adresse", value: location.address ?? "-" },
    { label: "Ville", value: location.city ?? "-" },
    { label: "Pays", value: location.countryCode ?? "-" },
    { label: "Latitude", value: location.latitude },
    { label: "Longitude", value: location.longitude },
    {
      label: "Tags",
      value:
        location.tags.length > 0 ? (
          <>
            {location.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-full border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </>
        ) : (
          "-"
        ),
    },
    ...Object.entries(location.externalRefs).map(([key, value]) => ({
      label: key,
      value,
    })),
    {
      label: "Ajouté le",
      value: location.createdAt ? new Date(location.createdAt).toLocaleString() : "-",
    },
    {
      label: "Modifié le",
      value: location.updatedAt ? new Date(location.updatedAt).toLocaleString() : "-",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto my-2 rounded-md overflow-hidden border border-slate-200 divide-y divide-slate-200">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className={"grid grid-cols-3 gap-4 px-4 py-3 odd:bg-slate-50/50 even:bg-slate-100/50"}
        >
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <span className="col-span-2 text-sm text-gray-900">{value}</span>
        </div>
      ))}
    </div>
  );
}

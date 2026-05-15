import { useQuery } from "@tanstack/react-query";
import type { Location } from "../types/location";
import { fetchLocationById } from "../api/locationApi";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../types/apiError";
import LocationDetail from "../components/LocationDetail";
import LocationMap from "../components/LocationMap";

export default function Location() {
  const { id } = useParams();
  const numericId = Number(id);
  const isValidId = Number.isInteger(numericId) && numericId > 0;

  const { data, isPending, error } = useQuery<Location>({
    queryKey: ["location", numericId],
    queryFn: () => fetchLocationById(numericId),
    enabled: isValidId,
  });

  if (error instanceof ApiError && error.status === 404) return <p>404 Location introuvable</p>;
  if (!isValidId) return <p>ID Invalide</p>;
  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;
  if (!data) return null;

  return (
    <div className="h-full flex flex-col">
      <h1 className="mb-6">
        {data.name} ({id ?? "N/A"})
      </h1>
      <div>
        <LocationDetail location={data} />
      </div>
      <div className="mt-2">
        <Link to={`/locations/${id}/edit`} className="btn">
          Modifier
        </Link>
      </div>
      <div className="mt-4 flex-1">
        <LocationMap latitude={data.latitude} longitude={data.longitude} name={data.name} />
      </div>
    </div>
  );
}

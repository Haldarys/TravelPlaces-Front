import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Location } from "../types/location";
import { fetchLocations, deleteLocation } from "../api/locationApi";
import { useNavigate } from "react-router-dom";

export default function LocationList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch des locations
  const { data, isPending, error } = useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  // Mutation delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;

  return (
    <>
      <h1>Liste des lieux</h1>
      <ul>
        {data?.map((loc) => (
          <li key={loc.id}>
            {loc.name} ({loc.latitude}, {loc.longitude})
            <button
              onClick={() => {
                deleteMutation.mutate(loc.id);
              }}
              className="btn"
            >
              Supprimer
            </button>
            <button
              onClick={() => {
                navigate(`/locations/${loc.id}`);
              }}
              className="btn"
            >
              Voir
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

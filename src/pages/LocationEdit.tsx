import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchLocationById, updateLocation } from "../api/locationApi";
import LocationForm from "../components/LocationForm";
import { useParams } from "react-router-dom";
import type { Location, LocationFormData } from "../types/location";

export default function LocationEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);
  const isValidId = Number.isInteger(numericId) && numericId > 0;

  const { data, isPending, error } = useQuery<Location>({
    queryKey: ["location", numericId],
    queryFn: () => fetchLocationById(numericId),
    enabled: isValidId,
  });

  const mutation = useMutation({
    mutationFn: (data: LocationFormData) => updateLocation(numericId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      navigate(`/locations/${numericId}`);
    },
  });

  if (!isValidId) return <p>ID Invalide</p>;
  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement</p>;
  if (!data) return null;

  const { createdAt, updatedAt, id: _id, ...formData } = data;

  function handleSubmit(submitData: LocationFormData) {
    mutation.mutate(submitData);
  }

  return (
    <>
      <h1 className="mb-6">
        {data.name} ({id ?? "N/A"})
      </h1>
      <LocationForm initialData={formData} onSubmit={handleSubmit} isPending={mutation.isPending} />
      {mutation.isError && <p className="mt-4 text-sm text-red-500">Erreur lors de la création</p>}
    </>
  );
}

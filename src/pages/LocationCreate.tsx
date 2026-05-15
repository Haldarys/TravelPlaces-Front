import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createLocation } from "../api/locationApi";
import LocationForm from "../components/LocationForm";
import type { LocationFormData } from "../types/location";

export default function LocationCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createLocation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      navigate(`/locations/${data.id}`);
    },
  });

  function handleSubmit(data: LocationFormData) {
    mutation.mutate(data);
  }

  return (
    <>
      <h1 className="mb-6">Nouveau lieu</h1>
      <LocationForm onSubmit={handleSubmit} isPending={mutation.isPending} />
      {mutation.isError && <p className="mt-4 text-sm text-red-500">Erreur lors de la création</p>}
    </>
  );
}

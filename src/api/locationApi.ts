import { ApiError } from "../types/apiError";
import type {
  Location,
  LocationFormData,
  LocationImage,
  LocationSearchOptions,
} from "../types/location";
import { API_URL } from "../config";

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    let message = "API Error";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Pas de message d'erreur fourni par l'API
    }

    throw new ApiError(response, message);
  }

  return response.json();
}

export async function fetchLocationById(id: number): Promise<Location> {
  return apiFetch<Location>(`${API_URL}/${id}`);
}

export async function fetchLocations(): Promise<Location[]> {
  return apiFetch<Location[]>(API_URL);
}

export async function fetchLocationsByBounds(bounds: L.LatLngBounds): Promise<Location[]> {
  const minLat = bounds.getSouth();
  const maxLat = bounds.getNorth();
  const minLng = bounds.getWest();
  const maxLng = bounds.getEast();
  const args = `bounds[minLat]=${minLat}&bounds[maxLat]=${maxLat}&bounds[minLng]=${minLng}&bounds[maxLng]=${maxLng}`;
  return apiFetch<Location[]>(`${API_URL}?${args}`);
}

export async function fetchLocationsBySearch(options: LocationSearchOptions): Promise<Location[]> {
  const params = new URLSearchParams(options);
  return apiFetch<Location[]>(`${API_URL}?${params.toString()}`);
}

export async function createLocation(data: LocationFormData): Promise<Location> {
  return apiFetch<Location>(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLocation(
  id: number,
  data: LocationFormData,
): Promise<LocationFormData> {
  return apiFetch<LocationFormData>(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteLocation(id: number): Promise<void> {
  return apiFetch<void>(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}

export async function fetchLocationImages(id: number): Promise<LocationImage[]> {
  return apiFetch<LocationImage[]>(`${API_URL}/locations/${id}/images`);
}

export async function uploadLocationImage(id: number, file: File) {
  const formData = new FormData();

  formData.append("file", file);

  await fetch(`${API_URL}/${id}/images`, {
    method: "POST",
    body: formData,
  });
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  countryCode?: string;
  tags: string[];
  externalRefs: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
  images: LocationImage[];
}

export type LocationFormData = Omit<Location, "id" | "createdAt" | "updatedAt" | "images">;

export type LocationSearchOptions = {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  countryCode?: string;
};

export type LocationImage = {
  id: number;
  location: string;
  filename: string;
  mimeType: string;
  position: number;
  createdAt: string;
};

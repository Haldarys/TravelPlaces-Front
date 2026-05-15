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
}

export type LocationFormData = Omit<Location, "id" | "createdAt" | "updatedAt">;

export type LocationSearchOptions = {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  countryCode?: string;
};

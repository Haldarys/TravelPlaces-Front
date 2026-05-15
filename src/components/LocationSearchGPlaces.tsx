import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { LocationFormData } from "../types/location";
import { useCombobox } from "downshift";

type Props = {
  onSelect: (data: LocationFormData) => void;
};

export default function LocationSearchGPlaces({ onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);

  const placesLibRef = useRef<google.maps.PlacesLibrary | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init Google Places API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    setOptions({
      key: apiKey,
      v: "weekly",
    });

    importLibrary("places").then((places: google.maps.PlacesLibrary) => {
      placesLibRef.current = places;
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    });
  }, []);

  // Fetch suggestion and fill the suggestions array
  const fetchSuggestions = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || !placesLibRef.current || !sessionTokenRef.current) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const { suggestions } =
        await placesLibRef.current!.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          sessionToken: sessionTokenRef.current!,
          language: "fr",
        });

      setSuggestions(suggestions);
    }, 300);
  };

  // Event selection of location from the suggestions
  const handleSelect = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
    if (!placesLibRef.current || !suggestion.placePrediction) return;

    const place = suggestion.placePrediction.toPlace();

    await place.fetchFields({
      fields: [
        "displayName",
        "editorialSummary",
        "formattedAddress",
        "location",
        "addressComponents",
        "id",
      ],
    });

    const components = place.addressComponents || [];

    const city = components.find((c) => c.types.includes("locality"))?.longText ?? "";

    const countryCode = components.find((c) => c.types.includes("country"))?.shortText ?? "";

    const result: LocationFormData = {
      name: place.displayName ?? "",
      description: place.editorialSummary ?? "",
      latitude: place.location?.lat() ?? 0,
      longitude: place.location?.lng() ?? 0,
      address: place.formattedAddress ?? "",
      city,
      countryCode,
      tags: [],
      externalRefs: {
        google_place_id: place.id ?? "",
      },
    };

    onSelect(result);

    // reset suggestions
    setSuggestions([]);

    // Create a new token for the next autocomplete session
    sessionTokenRef.current = new placesLibRef.current.AutocompleteSessionToken();
  };

  // Downshift autocomplete hook
  const { isOpen, getMenuProps, getInputProps, getItemProps, highlightedIndex } =
    useCombobox<google.maps.places.AutocompleteSuggestion>({
      items: suggestions,

      itemToString: (item) => item?.placePrediction?.text?.toString() ?? "",

      onInputValueChange: ({ inputValue }) => {
        fetchSuggestions(inputValue ?? "");
      },

      onSelectedItemChange: ({ selectedItem }) => {
        if (selectedItem) {
          handleSelect(selectedItem);
        }
      },
    });

  return (
    <div className="relative">
      <input
        {...getInputProps({
          placeholder: "Search location...",
        })}
      />

      {suggestions.length > 0 && isOpen && (
        <ul
          {...getMenuProps()}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded z-10"
        >
          {suggestions.map((item, index) => (
            <li
              key={index}
              {...getItemProps({ item, index })}
              className={`p-2 cursor-pointer select-none border-b border-b-slate-200 ${
                highlightedIndex === index ? "bg-slate-500 text-white" : "text-gray-700"
              }`}
            >
              {item.placePrediction?.text.toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

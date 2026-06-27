import { useState } from "react";
import type { LocationFormData } from "../types/location";
import LocationSearchGPlaces from "./LocationSearchGPlaces";
import { XIcon } from "@phosphor-icons/react";
const EXTERNAL_REFS = ["google_place_id", "wikidata_id", "osm_node_id"];

interface LocationFormProps {
  initialData?: LocationFormData;
  onSubmit: (data: LocationFormData) => void;
  isPending?: boolean;
}

const emptyForm: LocationFormData = {
  name: "",
  description: "",
  latitude: 0,
  longitude: 0,
  address: "",
  city: "",
  countryCode: "",
  tags: [],
  externalRefs: {},
};

export default function LocationForm({ initialData, onSubmit, isPending }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>(initialData ?? emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [selectedRef, setSelectedRef] = useState("");
  const [refValue, setRefValue] = useState("");

  const availableRefs = EXTERNAL_REFS.filter((ref) => !(ref in formData.externalRefs));

  // Form events

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "latitude" || name === "longitude" ? Number(value) : value,
    }));
  }

  function handleAddTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || formData.tags.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function handleAddRef() {
    if (!selectedRef || !refValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      externalRefs: { ...prev.externalRefs, [selectedRef]: refValue.trim() },
    }));
    setSelectedRef("");
    setRefValue("");
  }

  function handleRemoveRef(key: string) {
    const rest = { ...formData.externalRefs };
    delete rest[key];
    setFormData((prev) => ({ ...prev, externalRefs: rest }));
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  const rows: { label: string; required?: boolean; content: React.ReactNode }[] = [
    {
      label: "Nom",
      required: true,
      content: <input name="name" value={formData.name} onChange={handleChange} required />,
    },
    {
      label: "Description",
      content: (
        <textarea
          name="description"
          value={formData.description ?? ""}
          onChange={handleChange}
          rows={3}
        />
      ),
    },
    {
      label: "Adresse",
      content: <input name="address" value={formData.address ?? ""} onChange={handleChange} />,
    },
    {
      label: "Ville",
      content: <input name="city" value={formData.city ?? ""} onChange={handleChange} />,
    },
    {
      label: "Pays",
      content: (
        <input
          name="countryCode"
          value={formData.countryCode ?? ""}
          onChange={handleChange}
          maxLength={2}
          placeholder="FR"
        />
      ),
    },
    {
      label: "Latitude",
      required: true,
      content: (
        <input
          type="number"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          step="any"
        />
      ),
    },
    {
      label: "Longitude",
      required: true,
      content: (
        <input
          type="number"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          step="any"
        />
      ),
    },
    {
      label: "Tags",
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full border border-gray-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <XIcon />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              placeholder="Ajouter un tag..."
            />
            <button type="button" onClick={handleAddTag} className="btn text-sm">
              Ajouter
            </button>
          </div>
        </div>
      ),
    },
    {
      label: "Références externes",
      content: (
        <div className="space-y-2">
          {Object.entries(formData.externalRefs).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-32 shrink-0">{key}</span>
              <span className="flex-1 text-gray-900">{value}</span>
              <button
                type="button"
                onClick={() => handleRemoveRef(key)}
                className="text-gray-400 hover:text-gray-700"
              >
                <XIcon />
              </button>
            </div>
          ))}
          {availableRefs.length > 0 && (
            <div className="flex gap-2">
              <select
                value={selectedRef}
                onChange={(e) => setSelectedRef(e.target.value)}
                className="btn outline-none text-sm text-gray-500"
              >
                <option value="">Choisir...</option>
                {availableRefs.map((ref) => (
                  <option key={ref} value={ref}>
                    {ref}
                  </option>
                ))}
              </select>
              {selectedRef && (
                <input
                  value={refValue}
                  onChange={(e) => setRefValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRef())}
                  placeholder="Valeur..."
                />
              )}
              {selectedRef && (
                <button type="button" onClick={handleAddRef} className="btn text-sm">
                  Ajouter
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto rounded-md overflow-hidden divide-y divide-slate-200">
        <div className="rounded-md border border-slate-200">
          {/* Google API Location search input */}
          {!initialData && (
            <div className="grid grid-cols-3 gap-4 px-4 py-3 odd:bg-slate-50/50 even:bg-slate-100/50">
              <span className="flex items-center justify-center text-sm font-medium text-gray-500">
                Chercher un lieu
              </span>
              <div className="col-span-2">
                <LocationSearchGPlaces
                  onSelect={(data) => {
                    setFormData(data);
                  }}
                />
              </div>
            </div>
          )}
          {/* Data form inputs (setup in rows variable) */}
          {rows.map(({ label, required, content }) => (
            <div
              key={label}
              className="grid grid-cols-3 gap-4 px-4 py-3 odd:bg-slate-50/50 even:bg-slate-100/50"
            >
              <span className="flex items-center justify-center text-sm font-medium text-gray-500">
                {label}
                {required && <span className="text-red-400 ml-1">*</span>}
              </span>
              <div className="col-span-2">{content}</div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending}
          //   className="w-full py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
          className="btn mt-2"
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

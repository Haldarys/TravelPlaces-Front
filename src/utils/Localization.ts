const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });

export function getCountryName(countryCode: string): string {
  return regionNames.of(countryCode) ?? countryCode;
}

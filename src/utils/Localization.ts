const regionNames = new Intl.DisplayNames(["fr"], { type: "region" });

export function getCountryName(countryCode: string): string {
  const countryCodeUpperCase = countryCode.toUpperCase();
  return regionNames.of(countryCodeUpperCase) ?? countryCodeUpperCase;
}

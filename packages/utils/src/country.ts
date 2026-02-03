import countryNames from "i18n-iso-countries";
import { getCountry } from "country-currency-map";
import enLocale from "i18n-iso-countries/langs/en.json";

countryNames.registerLocale(enLocale);

export function getCountryFlag(countryCode: string) {
  if (!countryCode) return "🏳️";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getCountryInfo(countryCode: string) {
  if (!countryCode) return null;

  const countryName = countryNames.getName(countryCode, "en");
  const countryData = getCountry(countryCode);

  return {
    countryName: countryName || countryCode,
    currency: countryData?.currency || "",
    currencySymbol: countryData?.currencySymbol || "",
  };
}

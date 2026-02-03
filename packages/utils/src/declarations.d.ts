declare module "country-currency-map" {
  export interface CountryData {
    currency: string;
    currencySymbol: string;
    [key: string]: any;
  }
  export function getCountry(country: string): CountryData | null;
}

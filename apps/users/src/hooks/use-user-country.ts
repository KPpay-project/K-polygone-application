import { useState, useEffect } from 'react';
import { countries } from '@/utils/constants';

interface UserCountryData {
  countryCode: string;
  countryName: string;
  loading: boolean;
}

interface IpApiResponse {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string; 
  country_name: string; 
  country_code: string; 
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

export const useUserCountry = (): UserCountryData => {
  const [countryCode, setCountryCode] = useState<string>(countries[0].code);
  const [countryName, setCountryName] = useState<string>(countries[0].name);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
      
        const storedCountryCode = sessionStorage.getItem('user_country_code');
        if (storedCountryCode) {
          const supportedCountry = countries.find((c) => c.code === storedCountryCode);
          if (supportedCountry) {
            setCountryCode(supportedCountry.code);
            setCountryName(supportedCountry.name);
            setLoading(false);
            return;
          }
        }

      
        const response = await fetch('https://ipapi.co/json/');
        const data: IpApiResponse = await response.json();
        
       
        if (data && data.country_code) {
   
          const supportedCountry = countries.find((c) => c.code === data.country_code);
          
          if (supportedCountry) {
            setCountryCode(supportedCountry.code);
            setCountryName(supportedCountry.name);
            sessionStorage.setItem('user_country_code', supportedCountry.code);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user country:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, []);

  return { countryCode, countryName, loading };
};

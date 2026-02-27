import React from 'react';
import clsx from 'clsx';

type CountryFlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type CountryFlagVariant = 'circle' | 'rounded' | 'square';

interface CountryFlagProps {
  country: string;
  size?: CountryFlagSize;
  variant?: CountryFlagVariant;
  bordered?: boolean;
  className?: string;
}

/**
 * Expand this map anytime.
 * Keys must be lowercase.
 */
const COUNTRY_CODE_MAP: Record<string, string> = {
  nigeria: 'ng',
  france: 'fr',
  germany: 'de',
  benin: 'bj',
  'united states': 'us',
  usa: 'us',
  canada: 'ca',
  'united kingdom': 'gb',
  uk: 'gb',
  ghana: 'gh',
  togo: 'tg',
  cameroon: 'cm',
  senegal: 'sn',
  india: 'in',
  china: 'cn',
  brazil: 'br',
  italy: 'it',
  spain: 'es',
  netherlands: 'nl',
};

/**
 * Extract ISO-2 country code safely.
 */
function getCountryCode(country: string): string {
  if (!country) return 'xx';

  const normalized = country.trim().toLowerCase();

  // If already ISO-2 code
  if (normalized.length === 2) {
    return normalized;
  }

  return COUNTRY_CODE_MAP[normalized] ?? 'xx'; // fallback flag
}

const sizeClasses: Record<CountryFlagSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

const variantClasses: Record<CountryFlagVariant, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-md',
  square: 'rounded-none',
};

export function CountryFlag({
  country,
  size = 'md',
  variant = 'circle',
  bordered = true,
  className,
}: CountryFlagProps) {
  const countryCode = getCountryCode(country);

  return (
    <div
      aria-label={country}
      role="img"
      className={clsx(
        'bg-cover bg-center overflow-hidden shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        bordered && 'border',
        className,
      )}
      style={{
        backgroundImage: `url(https://flagcdn.com/48x36/${countryCode}.png)`,
      }}
    />
  );
}

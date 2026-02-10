import { ModularCard } from '@/components/sub-modules/card/card';
import { useDashboardStats } from '@/hooks/api/use-dashboard-stats';
import { getCountryCode } from '@/utils/constants';

export default function TopCountriesSection() {
  const { data, loading, error } = useDashboardStats();
  const topCountries = data?.adminDashboardStats?.topCountries || [];

  if (loading) {
    return (
      <ModularCard className="lg:w-[300px]">
        <div className="font-medium mb-4">Top Countries</div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </ModularCard>
    );
  }

  if (error) {
    return (
      <ModularCard className="lg:w-[300px]">
        <div className="font-medium mb-4">Top Countries</div>
        <div className="text-sm text-gray-500 text-center py-4">Failed to load countries data</div>
      </ModularCard>
    );
  }

  return (
    <ModularCard className="lg:w-[300px]">
      <div className="font-medium mb-4">Top Countries</div>
      <div className="space-y-3">
        {topCountries.length > 0 ? (
          topCountries.map((countryData, index) => (
            <div className="flex items-center justify-between" key={`${countryData.country}-${index}`}>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://flagcdn.com/48x36/${getCountryCode(countryData.country)}.png)`
                  }}
                  aria-label={countryData.country}
                />
                {countryData.country}
              </div>
              <span>{countryData.count ?? 'N/A'}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">No countries data available</div>
        )}
      </div>
    </ModularCard>
  );
}

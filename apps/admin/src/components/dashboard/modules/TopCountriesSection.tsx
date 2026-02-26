import { useState } from 'react';
import { useDashboardStats } from '@/hooks/api/use-dashboard-stats';
import type { TopCountry } from '@/hooks/api/use-dashboard-stats';
import { getCountryCode } from '@/utils/constants';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomModal,
  ModularCard,
  Skeleton,
  Typography
} from '@repo/ui';
import { formatCurrency } from '@repo/utils';
import { CountryFlag } from '@repo/ui';

function CountriesList({ countries }: { countries: TopCountry[] }) {
  return (
    <div className="space-y-4">
      {countries.map((country) => (
        <div key={country.country} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <CountryFlag size="sm" country={getCountryCode(country.country)} />
            <div className="flex flex-col">
              <Typography variant={'small'}>{country.country}</Typography>
              {/* <span className="text-xs text-muted-foreground">{country.transactionCount} transactions</span> */}
            </div>
          </div>

          <Typography variant={'tiny'}>{formatCurrency(country.totalVolume)}</Typography>
        </div>
      ))}
    </div>
  );
}

export default function TopCountriesSection() {
  const { data, loading, error } = useDashboardStats();
  const [isOpen, setIsOpen] = useState(false);

  const topCountries = data?.adminDashboardStats?.topCountries ?? [];
  const previewCountries = topCountries.slice(0, 5);
  const showViewAll = topCountries.length > 4;

  if (loading) {
    return (
      <ModularCard className="shadow-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </ModularCard>
    );
  }

  if (error) {
    return (
      <Card className="lg:w-[320px]">
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center text-sm text-muted-foreground">Failed to load countries data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ModularCard title={<Typography variant={'p'}>Top Countries</Typography>} className="w-full">
        {topCountries.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">No countries data available</div>
        ) : (
          <>
            <CountriesList countries={previewCountries} />

            {showViewAll && (
              <Button className="w-full mt-8" onClick={() => setIsOpen(true)} variant={'muted'}>
                Show All
              </Button>
            )}
          </>
        )}
      </ModularCard>

      <CustomModal open={isOpen} onOpenChange={setIsOpen} title="All Top Countries">
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
          <CountriesList countries={topCountries} />
        </div>
      </CustomModal>
    </>
  );
}

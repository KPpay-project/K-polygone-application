import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import useDashboardStats from '@/hooks/api/use-dashboard-stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import moment from 'moment';

export const description = 'An interactive bar chart';

const chartConfig = {
  views: {
    label: 'Wallets'
  },
  active: {
    label: 'Active',
    color: '#2563eb'
  },
  frozen: {
    label: 'Frozen',
    color: '#ef4444'
  }
} satisfies ChartConfig;

export default function WalletsSection({ filter }: { filter?: string }) {
  const [currency, setCurrency] = React.useState('ALL');
  const [activeChart, setActiveChart] = React.useState<'active' | 'frozen'>('active');
  const { data } = useDashboardStats({ country: filter, currency: currency === 'ALL' ? undefined : currency });

  const chartData = React.useMemo(() => {
    const rawData = data?.adminDashboardStats?.walletCountByMonth || [];
    const year = moment().year();

    const monthMap: Record<number, { active: number; frozen: number }> = {};
    rawData.forEach((item) => {
      let itemYear = item.year;
      let itemMonth = item.month;
      if ((!itemYear || !itemMonth) && item.monthLabel) {
        const parsed = moment(item.monthLabel, 'MMMM YYYY', true);
        if (parsed.isValid()) {
          itemYear = parsed.year();
          itemMonth = parsed.month() + 1;
        }
      }
      if (itemYear === year && itemMonth >= 1 && itemMonth <= 12) {
        monthMap[itemMonth] = {
          active: item.activeWallets || 0,
          frozen: item.frozenWallets || 0
        };
      }
    });

    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const date = moment({ year, month: i }).format('YYYY-MM-DD');
      const entry = monthMap[m] || { active: 0, frozen: 0 };
      return {
        date,
        active: entry.active,
        frozen: entry.frozen
      };
    });
  }, [data]);

  const total = React.useMemo(
    () => ({
      active: chartData.reduce((acc, curr) => acc + curr.active, 0),
      frozen: chartData.reduce((acc, curr) => acc + curr.frozen, 0)
    }),
    [chartData]
  );

  return (
    <Card className="h-full rounded-2xl border-0 shadow-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center gap-4">
            <CardTitle>Wallets</CardTitle>
            <div className="w-[150px]">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="XOF">XOF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Showing total wallets for the last 12 months</CardDescription>
        </div>
        <div className="flex">
          {(['active', 'frozen'] as const).map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">{total[key].toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

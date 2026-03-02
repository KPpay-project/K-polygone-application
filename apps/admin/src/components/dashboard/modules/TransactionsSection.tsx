import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import moment from 'moment';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModularCard } from '@/components/sub-modules/card/card';
import { useAdminTransactionStats } from '@/hooks/api/use-admin-dashboard-stats';

export const description = 'An interactive bar chart';

const chartConfig = {
  views: {
    label: 'Transactions'
  },
  completed: {
    label: 'Completed',
    color: '#16a34a'
  },
  failed: {
    label: 'Failed',
    color: '#dc2626'
  }
} satisfies ChartConfig;

export default function TransactionsSection() {
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [activeChart, setActiveChart] = React.useState<'completed' | 'failed'>('completed');
  const { data, loading } = useAdminTransactionStats();

  const filteredData = React.useMemo(() => {
    const trend = data?.monthlyTransactionTrend || [];
    const currentYear = selectedYear;

    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthStart = `${currentYear}-${month.toString().padStart(2, '0')}-01`;

      const existingData = trend.find((item) => {
        const itemMonth = new Date(item.monthStart).getMonth() + 1;
        const itemYear = new Date(item.monthStart).getFullYear();
        return itemMonth === month && itemYear === currentYear;
      });

      return {
        date: monthStart,
        completed: Math.max(0, existingData?.completed || 0),
        failed: Math.max(0, existingData?.failed || 0)
      };
    });

    return allMonths;
  }, [data, selectedYear]);

  const yearOptions = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => Math.max(2024, currentYear) + i);
  }, []);

  const total = React.useMemo(
    () => ({
      completed: filteredData.reduce((acc, curr) => acc + curr.completed, 0),
      failed: filteredData.reduce((acc, curr) => acc + curr.failed, 0)
    }),
    [filteredData]
  );

  return (
    <ModularCard
      title={
        <div className="flex items-center justify-between w-full">
          <span>Transactions</span>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="mb-4 flex border rounded-lg overflow-hidden w-fit">
        {(['completed', 'failed'] as const).map((key) => (
          <button
            key={key}
            data-active={activeChart === key}
            className="relative z-10 flex min-w-[120px] flex-col items-start gap-1 border-r px-4 py-3 text-left last:border-r-0 data-[active=true]:bg-slate-50"
            onClick={() => setActiveChart(key)}
          >
            <span className="text-xs text-muted-foreground">{chartConfig[key].label}</span>
            <span className="text-base font-semibold leading-none">{total[key].toLocaleString()}</span>
          </button>
        ))}
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading chart data...</div>
          </div>
        ) : (
          <BarChart
            accessibilityLayer
            data={filteredData}
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
              minTickGap={20}
              interval={0}
              tickFormatter={(value) => {
                return moment(value).format('MMM');
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[170px]"
                  nameKey="views"
                  labelFormatter={(value) => moment(value).format('MMMM YYYY')}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ChartContainer>
    </ModularCard>
  );
}

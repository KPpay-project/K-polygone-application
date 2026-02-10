import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import moment from 'moment';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModularCard } from '@/components/sub-modules/card/card';
import { useAdminTransactionStats } from '@/hooks/api/use-admin-dashboard-stats';

export const description = 'An interactive area chart';

const chartConfig = {
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
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-500">Loading chart data...</div>
          </div>
        ) : (
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-md">
                      <p className="font-medium text-gray-900 mb-2">{moment(label).format('MMMM YYYY')}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-gray-600">{entry.name}:</span>
                          <span className="font-medium">{entry.value?.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 text-sm text-gray-600">
                        Total: {payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0).toLocaleString()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="failed"
              type="natural"
              fill="url(#fillFailed)"
              stroke="#dc2626"
              strokeWidth={2}
              stackId="a"
              activeDot={{ r: 4, stroke: '#dc2626', strokeWidth: 2 }}
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              stroke="#16a34a"
              strokeWidth={2}
              stackId="a"
              activeDot={{ r: 4, stroke: '#16a34a', strokeWidth: 2 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        )}
      </ChartContainer>
    </ModularCard>
  );
}

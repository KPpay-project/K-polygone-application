import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ModularCard } from '@/components/sub-modules/card/card';
import useDashboardStats from '@/hooks/api/use-dashboard-stats';

export const description = 'A stacked bar chart with a legend';

import moment from 'moment';

function getChartData(walletCountByMonth: any[] | undefined) {
  const year = moment().year();

  const monthMap: Record<number, number> = {};
  (walletCountByMonth || []).forEach((item) => {
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
      monthMap[itemMonth] = item.walletCount || 0;
    }
  });

  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const label = moment({ year, month: i }).format('MMM YYYY');
    return {
      month: label,
      wallets: monthMap[m] || 0
    };
  });
}

const chartConfig = {
  wallets: {
    label: 'Wallets',
    color: 'rgb(37, 99, 235)'
  }
} satisfies ChartConfig;

export default function WalletsSection() {
  const { data } = useDashboardStats();
  const chartData = getChartData(data?.adminDashboardStats?.walletCountByMonth);

  console.log(chartData, 'displaying the chart data');

  let trending = 0;
  if (chartData.length >= 2) {
    const prev = chartData[chartData.length - 2].wallets;
    const curr = chartData[chartData.length - 1].wallets;
    if (prev > 0) {
      trending = ((curr - prev) / prev) * 100;
    } else if (curr > 0) {
      trending = 100;
    }
  }
  const trendingText = `Trending up by ${trending.toFixed(1)}% this month`;
  const summaryText = `Showing total wallets for the last 12 months`;
  return (
    <ModularCard className="h-[900px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Wallets</h3>
          <p className="text-sm text-muted-foreground">
            {chartData.length > 0 ? `${chartData[0].month} - ${chartData[chartData.length - 1].month}` : ''}
          </p>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} height={250}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={() => <ChartTooltipContent hideLabel />} />
            <ChartLegend content={() => <ChartLegendContent />} />
            <Bar dataKey="wallets" fill="rgb(37, 99, 235)" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ChartContainer>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            {trendingText} <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-muted-foreground">{summaryText}</p>
        </div>
      </div>
    </ModularCard>
  );
}

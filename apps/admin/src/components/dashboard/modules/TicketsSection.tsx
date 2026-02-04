'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ModularCard } from '@/components/sub-modules/card/card';
import { Frown, Smile, Laugh } from 'lucide-react';
export const description = 'A bar chart showing ticket statistics';
import useDashboardStats from '@/hooks/api/use-dashboard-stats';

interface TicketData {
  status: string;
  value: number;
  color: string;
}

function getChartData(ticketStats: any): TicketData[] {
  return [
    { status: 'Rejected', value: ticketStats?.rejected ?? 0, color: '#ef4444' },
    { status: 'In Review', value: ticketStats?.inReview ?? 0, color: '#eab308' },
    { status: 'Resolved', value: ticketStats?.resolved ?? 0, color: '#2563eb' },
    { status: 'Open', value: ticketStats?.open ?? 0, color: '#22c55e' }
  ];
}

const chartConfig = {
  value: {
    label: 'Tickets',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export default function TicketsSection() {
  const { data } = useDashboardStats();
  const ticketStats = data?.adminDashboardStats?.ticketStats || {};
  const chartData = getChartData(ticketStats);
  return (
    <ModularCard title={'Tickets'}>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          height={250}
          margin={{
            left: 12,
            right: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="value" fill="#2563eb" radius={8} fillOpacity={0.9} />
        </BarChart>

        <div className="flex items-center justify-around">
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              {item.status === 'Rejected' && <Frown className="w-6 h-6" style={{ color: item.color }} />}
              {item.status === 'In Review' && <Smile className="w-6 h-6" style={{ color: item.color }} />}
              {item.status === 'Resolved' && <Laugh className="w-6 h-6" style={{ color: item.color }} />}
              {item.status === 'Open' && <Smile className="w-6 h-6" style={{ color: item.color }} />}
              <div className="text-xl font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </ChartContainer>
    </ModularCard>
  );
}

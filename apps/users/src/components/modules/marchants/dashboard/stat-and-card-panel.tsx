import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/fallbacks';
import { Cards, EmptyWalletRemove } from 'iconsax-reactjs';

const MarchantStatAndCardPanel: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [analyticsView, setAnalyticsView] = useState('Money In');

  const chartData = [
    { month: 'Jan', value: 30000 },
    { month: 'Feb', value: 25000 },
    { month: 'Mar', value: 35000 },
    { month: 'Apr', value: 45000 },
    { month: 'May', value: 50000 },
    { month: 'Jun', value: 35000 },
    { month: 'Jul', value: 40000 },
    { month: 'Aug', value: 30000 }
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Analytics</h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAnalyticsView('Money In')}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                analyticsView === 'Money In' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Money In
            </button>
            <button
              onClick={() => setAnalyticsView('Money out')}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                analyticsView === 'Money out' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
              }`}
            >
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              Money out
            </button>
          </div>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
              <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-4 bg-gray-50 rounded-lg p-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-lg relative"
                style={{
                  height: `${(data.value / maxValue) * 200}px`
                }}
              >
                {data.month === 'Jul' && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {data.month} 2020
                    <br />
                    $50,659.9
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Transfer</h3>
          <div className="flex justify-between mb-4">
            {/* {recentUsers.map((user, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Avatar
                  size={48}
                  name={user.name}
                  variant="beam"
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
                {user.name}
              </div>
            ))} */}
            <EmptyState
              icon={<EmptyWalletRemove variant="Bulk" size={75} />}
              title="No recent transfer"
              description="You have no recent transfer"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">My cards</h3>
          </div>

          <EmptyState icon={<Cards variant="Bulk" size={75} />} title="No cards" description="You have no cards yet" />

          {/* <PaymentCard /> */}
          <center>
            <Button variant={'muted'} className="text-sm mt-3 ">
              + Create Card
            </Button>
          </center>
        </div>
      </div>
    </div>
  );
};
export default MarchantStatAndCardPanel;

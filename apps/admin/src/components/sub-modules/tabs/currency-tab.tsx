import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TabItem<T = any> {
  id: string;
  label: string;
  data: T;
}

interface CurrencyTabsProps<T = any> {
  tabs: TabItem<T>[];
  value: string;
  onChange: (value: string) => void;
  renderTabContent: (tab: TabItem<T>) => React.ReactNode;
  renderTabTrigger?: (tab: TabItem<T>) => React.ReactNode;
}

export function CurrencyTabs<T>({ tabs, value, onChange, renderTabContent, renderTabTrigger }: CurrencyTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={onChange} className="mb-12">
      <TabsList className="flex justify-center gap-4 bg-transparent">
        <div className={'bg-gray-100 px-6 py-3 flex justify-center p-2 rounded-xl'}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-white  shadow-0
              text-gray-700 rounded-2xl !shadow-0
                flex items-center px-6 py-2 space-x-2 "
            >
              {renderTabTrigger ? renderTabTrigger(tab) : <span>{tab.label}</span>}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-8">
          {renderTabContent(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

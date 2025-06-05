import React from 'react';
    import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

    const MeditationTabs = ({ activeTab, onTabChange, categories }) => {
      return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      );
    };

    export default MeditationTabs;
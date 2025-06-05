import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MoodSummaryChart = ({ moodSummary }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Moods This Week</h3>
        <div className="h-48 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={moodSummary.stats} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={60} 
                labelLine={false} 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {moodSummary.stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))', 
                borderRadius: 'var(--radius)' 
              }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {moodSummary.trend.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Mood Trend (Last 7 Days)</h3>
          <div className="h-40 sm:h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodSummary.trend} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis domain={[0, 5]} allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: 'var(--radius)' 
                }}/>
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSummaryChart;
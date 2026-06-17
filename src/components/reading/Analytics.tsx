/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { DailyLog } from '@/src/types';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import GlassCard from '../layout/GlassCard';

interface AnalyticsProps {
  logs: DailyLog[];
}

export default function ReadingAnalytics({ logs }: AnalyticsProps) {
  // Generate last 7 days of data
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStr = format(date, 'EEE');
    const logsForDay = logs.filter(log => isSameDay(new Date(log.date), date));
    const pages = logsForDay.reduce((sum, log) => sum + log.pagesRead, 0);
    return { name: dayStr, pages };
  });

  return (
    <GlassCard className="h-64 bg-white/70 border-white/80">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-bold">Weekly Progress</h3>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(59,130,246,0.05)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid rgba(226, 232, 240, 1)',
                borderRadius: '12px',
                color: '#1e293b',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
            />
            <Bar dataKey="pages" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.pages > 50 ? '#10b981' : '#3b82f6'} 
                  fillOpacity={index === 6 ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

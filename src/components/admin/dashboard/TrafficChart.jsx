import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficChart({ data }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm lg:col-span-2 border border-slate-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Traffic Overview</h2>
          <p className="text-sm text-slate-400">Profile views across all users</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`${value.toLocaleString()} views`, 'Views']}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: '#4F46E5' }} 
              activeDot={{ r: 6, fill: '#4F46E5', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
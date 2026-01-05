import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CompetencyRow } from '../types';

interface Props {
  data: CompetencyRow[];
}

const PerformanceChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-r-4 border-yellow-500 pr-3">
        مبيان تطور أداء التلاميذ (حسب الكفايات)
      </h3>
      <div className="h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as CompetencyRow;
                  return (
                    <div className="bg-white p-3 border border-gray-200 shadow-md rounded text-right" dir="rtl">
                      <p className="font-bold text-gray-900">{item.code}</p>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-yellow-600 font-bold">التحكم: {item.mastery}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar name="نسبة التحكم" dataKey="mastery" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.mastery < 50 ? '#ef4444' : (entry.mastery < 80 ? '#fbbf24' : '#10b981')} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
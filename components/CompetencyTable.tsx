import React from 'react';
import { CompetencyRow } from '../types';

interface Props {
  data: CompetencyRow[];
  onUpdate: (index: number, field: keyof CompetencyRow, value: string | number) => void;
}

const CompetencyTable: React.FC<Props> = ({ data, onUpdate }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border-2 border-black bg-white print:shadow-none print:border-black">
      <table className="min-w-full divide-y divide-black border-collapse">
        <thead className="bg-gray-800 text-white print:bg-white print:text-black">
          <tr>
            <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider w-16 border-l border-black print:border-black print:py-1 print:text-[10px]">الرمز</th>
            <th className="px-4 py-3 text-right text-sm font-bold uppercase tracking-wider w-1/3 border-l border-black print:border-black print:py-1 print:text-[10px]">الكفايات</th>
            <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider w-32 bg-blue-600 border-l border-black text-white print:bg-white print:text-black print:border-black print:py-1 print:text-[10px]">نسبة التحكم</th>
            <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider bg-emerald-600 text-white print:bg-white print:text-black print:border-black print:py-1 print:text-[10px]">اسماء التلاميذ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-black">
          {data.map((row, index) => (
            <tr key={row.code} className="hover:bg-gray-50 transition-colors print:hover:bg-transparent break-inside-avoid">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-center text-gray-900 bg-gray-50 border-l border-black print:bg-white print:text-black print:border-black print:py-1 print:text-[10px]">
                {row.code}
              </td>
              <td className="px-4 py-4 text-base font-bold text-gray-900 leading-relaxed border-l border-black text-right print:bg-white print:text-black print:border-black print:py-1 print:text-[10px] print:leading-tight">
                {row.description}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center bg-blue-50 border-l border-black print:bg-white print:border-black print:py-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={row.mastery}
                  onChange={(e) => onUpdate(index, 'mastery', Number(e.target.value))}
                  className="w-full p-2 border-0 bg-transparent text-center font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 rounded-md print:text-black print:p-0 print:text-[10px] print:h-auto"
                />
              </td>
              <td className="px-4 py-4 bg-emerald-50 print:bg-white print:border-black print:py-1">
                <textarea
                  rows={2}
                  value={row.students}
                  onChange={(e) => onUpdate(index, 'students', e.target.value)}
                  placeholder="أسماء التلاميذ المتعثرين..."
                  className="w-full p-2 border-0 bg-transparent text-sm text-gray-800 focus:ring-2 focus:ring-emerald-500 rounded-md resize-none text-right placeholder-gray-400 print:text-black print:placeholder-transparent print:p-0 print:text-[10px] print:h-auto print:leading-tight"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetencyTable;
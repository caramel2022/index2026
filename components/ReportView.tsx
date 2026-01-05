import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  report: string;
  isLoading: boolean;
  onGenerate: () => void;
}

const ReportView: React.FC<Props> = ({ report, isLoading, onGenerate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-full flex flex-col print:border-none print:shadow-none print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h3 className="text-xl font-bold text-gray-800 border-r-4 border-blue-500 pr-3">
          تقرير نقاط القوة والضعف (ملف الكفايات)
        </h3>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'جاري التحليل...' : 'توليد التقرير'}
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto prose prose-blue max-w-none text-right bg-gray-50 p-4 rounded-md border border-gray-100 print:bg-white print:border-none print:p-0 print:text-black" dir="rtl">
        {report ? (
          <div className="print:block">
            <ReactMarkdown components={{
              p: ({node, ...props}) => <p style={{ breakInside: 'avoid' }} {...props} />,
              li: ({node, ...props}) => <li style={{ breakInside: 'avoid' }} {...props} />,
              h1: ({node, ...props}) => <h1 style={{ breakAfter: 'avoid' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ breakAfter: 'avoid' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ breakAfter: 'avoid' }} {...props} />,
            }}>
              {report}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 print:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>اضغط على "توليد التقرير" للحصول على تحليل مفصل</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;
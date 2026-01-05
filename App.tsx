import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_DATA, CompetencyRow } from './types';
import CompetencyTable from './components/CompetencyTable';
import PerformanceChart from './components/PerformanceChart';
import ReportView from './components/ReportView';
import { generatePerformanceReport } from './services/geminiService';
import { saveReportData, loadReportData } from './services/db';

const App: React.FC = () => {
  const [data, setData] = useState<CompetencyRow[]>(INITIAL_DATA);
  const [report, setReport] = useState<string>('');
  const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Load data from IndexedDB on mount
  useEffect(() => {
    const fetchData = async () => {
      const savedData = await loadReportData();
      if (savedData) {
        setData(savedData);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = useCallback((index: number, field: keyof CompetencyRow, value: string | number) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveReportData(data);
      if (success) {
        alert('تم حفظ البيانات بنجاح.');
      } else {
        alert('فشل حفظ البيانات.');
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء محاولة حفظ البيانات.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('report-content');
    
    const opt = {
      margin:       [10, 10], // Margins: top, left, bottom, right
      filename:     `تقرير_الكفايات_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] } // Enable CSS based page breaks
    };

    // Access the global html2pdf variable
    const html2pdf = (window as any).html2pdf;

    if (typeof html2pdf !== 'function') {
      console.error('html2pdf library is not loaded correctly.', html2pdf);
      alert('حدث خطأ فني أثناء محاولة تحميل مكتبة PDF.');
      setIsDownloading(false);
      return;
    }

    // Use html2pdf library
    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch((err: any) => {
      console.error(err);
      setIsDownloading(false);
      alert('حدث خطأ أثناء تحميل الملف.');
    });
  };

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    try {
      const result = await generatePerformanceReport(data);
      setReport(result);
    } catch (error) {
      setReport("حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من مفتاح API.");
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-gradient-to-l from-yellow-500 to-orange-400 shadow-lg mb-8" data-html2canvas-ignore="true">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-sm font-amiri leading-tight py-2">
            تقرير حول نتائج روائز المرحلة الأولى
          </h1>
          <p className="text-yellow-100 mt-3 font-medium text-lg font-amiri">نظام تحليل ودعم الكفايات التربوية</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Actions Toolbar - Hidden in PDF */}
        <div className="flex flex-wrap justify-end gap-4 mb-4" data-html2canvas-ignore="true">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:bg-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-bold focus:ring-2 focus:ring-gray-600 focus:outline-none disabled:bg-gray-400"
          >
            {isDownloading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span>{isDownloading ? 'جاري التحضير...' : 'تحميل PDF'}</span>
          </button>
        </div>

        {/* Printable Area Wrapper */}
        <div id="report-content" className="bg-white rounded-lg p-4">
          
          {/* PDF HEADER: Only visible in PDF */}
          <div className="text-center mb-8 hidden font-amiri" id="pdf-header" style={{ display: isDownloading ? 'block' : 'none' }}>
             <div className="border-b-4 border-double border-gray-800 pb-6 mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">المملكة المغربية</h1>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">تقرير تقويم المستلزمات الدراسية</h2>
                <div className="flex justify-center gap-8 mt-4 text-xl text-gray-700 font-bold">
                    <span>السنة الدراسية: {new Date().getFullYear()}/{new Date().getFullYear()+1}</span>
                    <span>|</span>
                    <span>المادة: اللغة العربية</span>
                </div>
             </div>
          </div>

          {/* PAGE 1: Data Table */}
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center font-amiri">
              <span className="text-yellow-500 ml-2">📊</span> 
              جدول تفريغ نتائج المتعلمين
            </h2>
            <CompetencyTable data={data} onUpdate={handleUpdate} />
          </div>

          {/* FORCE PAGE BREAK */}
          <div className="w-full h-1" style={{ pageBreakBefore: 'always' }}></div>

          {/* PAGE 2: Chart */}
          <div className="w-full mb-8 pt-8">
             <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
               <PerformanceChart data={data} />
            </div>
          </div>

          {/* FORCE PAGE BREAK */}
          <div className="w-full h-1" style={{ pageBreakBefore: 'always' }}></div>

          {/* PAGE 3+: Report */}
          <div className="w-full pt-8 min-h-[800px]">
             <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm h-full">
               <ReportView 
                 report={report} 
                 isLoading={isReportLoading} 
                 onGenerate={handleGenerateReport} 
               />
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm pb-6" data-html2canvas-ignore="true">
        <p>© 2024 جميع الحقوق محفوظة - منصة التحليل التربوي الذكي</p>
      </footer>
    </div>
  );
};

export default App;
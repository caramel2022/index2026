import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await editImageWithGemini(selectedImage, prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError("فشلت عملية تعديل الصورة. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-8">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 border-r-4 border-purple-500 pr-3 ml-2">
          استوديو الصور الذكي
        </h3>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-200">
          مدعوم بـ Gemini 2.5
        </span>
      </div>
      
      <p className="text-gray-600 mb-6">
        قم برفع صور أنشطة القسم واكتب تعديلاتك (مثال: "أضف فلتر كرتوني"، "أضف نجوم ذهبية في الخلفية").
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 font-medium">اضغط لرفع صورة</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف التعديل المطلوب</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: اجعل الخلفية سبورة مدرسية..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={handleEdit}
                disabled={!selectedImage || !prompt || isLoading}
                className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${
                  !selectedImage || !prompt || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isLoading ? 'جاري المعالجة...' : 'تعديل'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
             {selectedImage ? (
               <img src={selectedImage} alt="Original" className="w-full h-full object-contain" />
             ) : (
               <span className="text-gray-400 text-sm">الصورة الأصلية</span>
             )}
          </div>
          <div className="aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
            {generatedImage ? (
               <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
             ) : (
               <div className="flex flex-col items-center">
                 {isLoading && (
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                 )}
                 <span className="text-gray-400 text-sm">الصورة المعدلة</span>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
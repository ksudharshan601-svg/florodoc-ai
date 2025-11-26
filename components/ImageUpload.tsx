import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ease-in-out text-center cursor-pointer group
        ${isDragging 
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 scale-102 shadow-lg' 
          : 'border-gray-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-slate-900'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onInputChange}
        />
        
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ImageIcon size={100} className="text-emerald-800 dark:text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-emerald-200 dark:bg-emerald-800' : 'bg-emerald-100 dark:bg-slate-800 group-hover:bg-emerald-200 dark:group-hover:bg-slate-700'}`}>
            <UploadCloud size={40} className="text-emerald-700 dark:text-emerald-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              Upload Plant Photo
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Drag & drop or click to browse
            </p>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500 pt-2 font-medium">
            Supports JPG, PNG (Max 5MB)
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
         <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm font-medium">Or take a photo directly</p>
         <button 
           onClick={() => fileInputRef.current?.click()}
           className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 px-6 py-3 rounded-full shadow-sm transition-all duration-200 font-medium"
         >
           <Camera size={20} />
           <span>Open Camera</span>
         </button>
      </div>
    </div>
  );
};
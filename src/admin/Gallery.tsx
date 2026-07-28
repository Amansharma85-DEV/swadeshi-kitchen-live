import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon, Link as LinkIcon, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { getGallery, saveGallery, type GalleryImage } from '../lib/store';
import { fetchApiSetting, saveApiSetting, subscribeToLiveSync, uploadImageFileApi } from '../lib/api';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [newUrl, setNewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGalleryData = async () => {
    const apiGallery = await fetchApiSetting<GalleryImage[]>('gallery');
    if (apiGallery && Array.isArray(apiGallery)) {
      setImages(apiGallery);
      saveGallery(apiGallery);
    } else {
      setImages(getGallery());
    }
  };

  useEffect(() => {
    loadGalleryData();
    const interval = setInterval(loadGalleryData, 2000);
    const unsubscribe = subscribeToLiveSync(loadGalleryData);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let cleanUrl = newUrl.trim();
    if (cleanUrl.startsWith('http://swadeshikitchen.shop') || cleanUrl.startsWith('http://43.204.145.203')) {
      cleanUrl = cleanUrl.replace('http://', 'https://');
    }

    const nextGallery = [...images, { id: Date.now(), url: cleanUrl }];
    setImages(nextGallery);
    saveGallery(nextGallery);
    await saveApiSetting('gallery', nextGallery);
    setNewUrl('');
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file format. Please upload JPG, PNG, WEBP, GIF, or SVG.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 50MB.');
      return;
    }

    setSelectedFile(file);
    try {
      setPreviewUrl(URL.createObjectURL(file));
    } catch (e) {
      console.warn('URL.createObjectURL fallback:', e);
    }
  };

  const handleFileUploadSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(30);

    const uploadRes = await uploadImageFileApi(selectedFile);
    setUploadProgress(90);

    let finalUrl = '';
    if (uploadRes.success && uploadRes.url) {
      finalUrl = uploadRes.url;
    } else if (previewUrl) {
      finalUrl = previewUrl;
    }

    if (finalUrl) {
      const nextGallery = [...images, { id: Date.now(), url: finalUrl }];
      setImages(nextGallery);
      saveGallery(nextGallery);
      await saveApiSetting('gallery', nextGallery);

      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setUploadError('Failed to upload image. Please try again.');
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(null);
    }, 600);
  };

  const handleDelete = async (id: number) => {
    const nextGallery = images.filter(img => img.id !== id);
    setImages(nextGallery);
    saveGallery(nextGallery);
    await saveApiSetting('gallery', nextGallery);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Gallery Management</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Upload dish photos directly or add links displayed live on AWS EC2.</p>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-500" size={20} />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">Add New Photo to Gallery</h2>
          </div>

          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-950 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <Upload size={14} />
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${activeTab === 'url' ? 'bg-white dark:bg-slate-950 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              <LinkIcon size={14} />
              Paste URL Link
            </button>
          </div>
        </div>

        {activeTab === 'upload' ? (
          <div className="space-y-4">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-6 rounded-xl border-2 border-dashed transition-all ${isDragging ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 scale-[1.01]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'}`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Gallery Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} 
                        className="absolute inset-0 bg-slate-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className="text-slate-400" size={32} />
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Upload size={16} />
                      {selectedFile ? 'Change Selected File' : 'Browse Photo File'}
                    </button>

                    {selectedFile && (
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={handleFileUploadSubmit}
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-orange-500/25"
                      >
                        <Plus size={16} />
                        {isUploading ? 'Uploading to AWS...' : 'Upload & Add to Gallery'}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    Supports JPG, PNG, WEBP, GIF (Max 50MB). Drag and drop your image anywhere above.
                  </p>

                  {uploadProgress !== null && (
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                      <div className="bg-orange-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mt-1">
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="url" 
              required
              value={newUrl} 
              onChange={e => setNewUrl(e.target.value)} 
              placeholder="Paste image URL (e.g. https://images.unsplash.com/...)" 
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-medium" 
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md">
              <Plus size={18} />
              Add Image Link
            </button>
          </form>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Gallery Items ({images.length})</h3>
        
        {images.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map(img => (
              <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm transition-all hover:shadow-md">
                <img 
                  src={img.url.startsWith('http://') ? img.url.replace('http://', 'https://') : img.url} 
                  alt="Gallery Item" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.startsWith('http://')) {
                      target.src = target.src.replace('http://', 'https://');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleDelete(img.id)} 
                    className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl shadow-lg transform scale-90 group-hover:scale-100 transition-all font-bold flex items-center gap-1.5 text-xs"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/40">
            <ImageIcon className="mx-auto text-slate-400 mb-3" size={40} />
            <p className="font-bold text-slate-700 dark:text-slate-300">No Gallery Photos Yet</p>
            <p className="text-xs text-slate-500 mt-1">Upload a file or paste a photo URL above to display items in your website gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
}

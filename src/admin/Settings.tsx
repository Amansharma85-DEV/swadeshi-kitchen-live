import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Image as ImageIcon, MessageCircle, Globe, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { getSettings, saveSettings, type GlobalSettings } from '../lib/store';

export default function Settings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'whatsapp' | 'seo'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const handleSave = () => {
    setIsSaving(true);
    saveSettings(settings);
    setTimeout(() => setIsSaving(false), 800);
  };

  const updateSetting = (section: keyof GlobalSettings, field: string, value: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Website Settings</h1>
          <p className="mt-1 text-slate-500">Manage your website's content, contact info, and SEO.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'hero' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <ImageIcon size={18} /> Hero Banner
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'contact' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Phone size={18} /> Contact Info
          </button>
          <button 
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'whatsapp' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button 
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'seo' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Globe size={18} /> SEO Details
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Hero Banner</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Main Title</label>
                <input 
                  type="text" 
                  value={settings.hero.title} 
                  onChange={e => updateSetting('hero', 'title', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                <textarea 
                  value={settings.hero.subtitle} 
                  onChange={e => updateSetting('hero', 'subtitle', e.target.value)} 
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Background Image URL</label>
                <input 
                  type="text" 
                  value={settings.hero.backgroundImage} 
                  onChange={e => updateSetting('hero', 'backgroundImage', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
                {settings.hero.backgroundImage && (
                  <div className="mt-4 w-full h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={settings.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <Mail size={16} className="text-slate-400" /> Business Email
                  </label>
                  <input 
                    type="email" 
                    value={settings.contact.email} 
                    onChange={e => updateSetting('contact', 'email', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <Phone size={16} className="text-slate-400" /> Phone Number
                  </label>
                  <input 
                    type="text" 
                    value={settings.contact.phone} 
                    onChange={e => updateSetting('contact', 'phone', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <Clock size={16} className="text-slate-400" /> Opening Hours
                </label>
                <input 
                  type="text" 
                  value={settings.contact.openingHours} 
                  onChange={e => updateSetting('contact', 'openingHours', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin size={16} className="text-slate-400" /> Physical Address
                </label>
                <textarea 
                  value={settings.contact.address} 
                  onChange={e => updateSetting('contact', 'address', e.target.value)} 
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">WhatsApp Integration</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">WhatsApp Number</label>
                <p className="text-xs text-slate-500 mb-3">Include the country code without any + or symbols (e.g. 919999999999).</p>
                <input 
                  type="text" 
                  value={settings.whatsapp.number} 
                  onChange={e => updateSetting('whatsapp', 'number', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Order Message Prefix</label>
                <p className="text-xs text-slate-500 mb-3">The first sentence sent to you before the order details.</p>
                <textarea 
                  value={settings.whatsapp.messageTemplate} 
                  onChange={e => updateSetting('whatsapp', 'messageTemplate', e.target.value)} 
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white" 
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">SEO & Metadata</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Website Title Tag</label>
                <p className="text-xs text-slate-500 mb-3">Appears in the browser tab and Google search results.</p>
                <input 
                  type="text" 
                  value={settings.seo.title} 
                  onChange={e => updateSetting('seo', 'title', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                <textarea 
                  value={settings.seo.description} 
                  onChange={e => updateSetting('seo', 'description', e.target.value)} 
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

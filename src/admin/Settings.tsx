import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, MessageCircle, Globe, Phone, Server, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSettings, saveSettings, type GlobalSettings } from '../lib/store';
import { fetchApiSetting, saveApiSetting, subscribeToLiveSync, getApiBaseUrl, setApiBaseUrl } from '../lib/api';

export default function Settings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'whatsapp' | 'seo' | 'server'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Server API URL state
  const [serverUrlInput, setServerUrlInput] = useState(getApiBaseUrl());
  const [pingStatus, setPingStatus] = useState<'testing' | 'online' | 'offline' | null>(null);

  const testConnection = async (urlToTest: string) => {
    setPingStatus('testing');
    const cleanUrl = urlToTest.trim().replace(/\/+$/, '');
    try {
      const res = await fetch(`${cleanUrl}/health?_t=${Date.now()}`);
      if (res.ok) {
        setPingStatus('online');
      } else {
        setPingStatus('offline');
      }
    } catch (e) {
      setPingStatus('offline');
    }
  };

  const loadSettingsData = async () => {
    const apiSettings = await fetchApiSetting<GlobalSettings>('global_settings');
    if (apiSettings && typeof apiSettings === 'object') {
      setSettings(apiSettings);
      saveSettings(apiSettings);
    } else {
      setSettings(getSettings());
    }
  };

  useEffect(() => {
    loadSettingsData();
    testConnection(serverUrlInput);
    const interval = setInterval(loadSettingsData, 2000);
    const unsubscribe = subscribeToLiveSync(loadSettingsData);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  if (!settings) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Save server URL if modified
    if (serverUrlInput.trim() !== getApiBaseUrl()) {
      setApiBaseUrl(serverUrlInput);
      testConnection(serverUrlInput);
    }
    saveSettings(settings);
    await saveApiSetting('global_settings', settings);
    setTimeout(() => setIsSaving(false), 500);
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
          <p className="mt-1 text-slate-500">Manage your website's content, contact info, and AWS Backend Connection.</p>
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
          <button 
            onClick={() => setActiveTab('server')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'server' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm border border-slate-200 dark:border-slate-800' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Server size={18} /> Server Connection
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
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={settings.contact.phone} 
                    onChange={e => updateSetting('contact', 'phone', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={settings.contact.email} 
                    onChange={e => updateSetting('contact', 'email', e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Restaurant Address</label>
                <input 
                  type="text" 
                  value={settings.contact.address} 
                  onChange={e => updateSetting('contact', 'address', e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Opening Hours</label>
                <input 
                  type="text" 
                  value={settings.contact.openingHours} 
                  onChange={e => updateSetting('contact', 'openingHours', e.target.value)} 
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
                <p className="text-xs text-slate-500 mb-3">Include the country code without any + or symbols (e.g. 919599749976).</p>
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

          {activeTab === 'server' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">AWS EC2 Server Connection</h2>
                  <p className="text-xs text-slate-500 mt-1">View or update your live AWS EC2 / Cloudflare Tunnel API endpoint URL.</p>
                </div>
                {pingStatus === 'testing' && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full">
                    <RefreshCw size={14} className="animate-spin" /> Testing...
                  </span>
                )}
                {pingStatus === 'online' && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={14} /> Backend Online (200 OK)
                  </span>
                )}
                {pingStatus === 'offline' && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
                    <AlertCircle size={14} /> Tunnel Offline (Check EC2)
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Backend API Base URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={serverUrlInput} 
                    onChange={e => {
                      setServerUrlInput(e.target.value);
                      testConnection(e.target.value);
                    }}
                    placeholder="https://your-tunnel-url.trycloudflare.com/api"
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono text-sm" 
                  />
                  <button 
                    type="button"
                    onClick={() => testConnection(serverUrlInput)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors"
                  >
                    <RefreshCw size={16} /> Test Ping
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  If your Cloudflare tunnel restarts on EC2, paste the new <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-orange-600">https://...trycloudflare.com/api</code> URL above and click <strong>Save Settings</strong>.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <AlertCircle size={16} /> How to get your live Backend Cloudflare Tunnel URL:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-1 text-amber-700 dark:text-amber-400">
                  <li>SSH into your EC2 instance (`ec2-user@43.204.145.203`).</li>
                  <li>Run <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">cloudflared tunnel --url http://localhost:5000</code> or check your tunnel service.</li>
                  <li>Copy the generated <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">https://...trycloudflare.com</code> URL and append <code className="font-mono font-bold">/api</code>.</li>
                  <li>Paste it into the box above and click <strong>Save Settings</strong>!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

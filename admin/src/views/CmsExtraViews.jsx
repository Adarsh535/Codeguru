import React, { useState } from 'react';
import { 
  Image as ImageIcon, UploadCloud, Copy, ExternalLink, Trash2, 
  Settings, Globe, Search, Plus, Save, CheckCircle2, Eye, Sparkles,
  Share2, Code2, ShieldCheck, AlertCircle, Monitor, Smartphone, Key, Check
} from 'lucide-react';

// ==========================================
// 1. MEDIA LIBRARY VIEW
// ==========================================
export function MediaLibraryView() {
  const [mediaItems] = useState([
    { id: 'm1', name: 'hero-banner-main.webp', size: '240 KB', type: 'image', url: '/hero-banner.jpg', date: '01 Sep 2026' },
    { id: 'm2', name: 'placement-poster-tcs.png', size: '180 KB', type: 'image', url: '/placement-poster.jpg', date: '03 Sep 2026' },
    { id: 'm3', name: 'course-syllabus-fullstack.pdf', size: '1.2 MB', type: 'document', url: '/syllabus.pdf', date: '05 Sep 2026' }
  ]);

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Media Repository & File Manager</h1>
          <p className="text-xs font-semibold text-slate-500">Manage uploaded banners, posters, PDFs & video thumbnails</p>
        </div>
        <button onClick={() => alert('File Picker Opened')} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
          <UploadCloud className="w-4 h-4" /> Upload New File
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {mediaItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="h-36 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 truncate">{item.name}</h3>
              <p className="text-[11px] font-medium text-slate-400">{item.size} • {item.date}</p>
            </div>
            <button
              onClick={() => copyUrl(item.url)}
              className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200/80"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Image Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. WEBSITE SETTINGS VIEW
// ==========================================
export function WebsiteSettingsView() {
  const [announcement, setAnnouncement] = useState('🔥 Admissions Open for September 2026 Batch! Get up to 30% Scholarship.');
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Website Frontend Settings</h1>
          <p className="text-xs font-semibold text-slate-500">Configure global website announcements, helpline contacts & brand info</p>
        </div>

        <div className="space-y-4 text-xs font-medium">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <div className="font-extrabold text-slate-900">Enable Top Announcement Bar</div>
              <div className="text-[11px] text-slate-500">Show ticker announcement alert on public website homepage</div>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Top Announcement Ticker Text</label>
            <input
              type="text"
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => alert('Website settings saved!')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Website Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADVANCED SEO & META CONFIGURATION VIEW
// ==========================================
export function SeoSettingsView() {
  const [seo, setSeo] = useState({
    title: 'CodeGuru Academy - Premier IT Training & Placement Institute in Pune',
    description: 'Master Full Stack Web Development, Data Science, AI & Python Analytics with 100% placement support at CodeGuru Academy. Enroll now for industry courses.',
    keywords: 'CodeGuru Academy, Full Stack Web Development Course Pune, IT Training Institute Pune, Data Science Course, MERN Stack Coaching',
    canonicalUrl: 'https://codeguru.in/',
    slug: 'best-full-stack-it-training-institute-pune',
    ogTitle: 'CodeGuru Academy | #1 IT Training & Placement Institute',
    ogDescription: 'Transform your tech career with 100% placement assistance, real-world industry projects & expert mentorship.',
    ogImage: 'https://codeguru.in/assets/og-social-banner.jpg',
    twitterCard: 'summary_large_image',
    googleSiteVerification: 'google-site-verification-cg-tech-7890123',
    googleAnalyticsId: 'G-CG99887766',
    robotsIndex: true,
    robotsFollow: true,
    enableSchema: true,
    schemaType: 'EducationalOrganization'
  });

  const [previewDevice, setPreviewDevice] = useState('desktop');

  const getSeoScore = () => {
    let score = 0;
    if (seo.title.length >= 40 && seo.title.length <= 60) score += 20;
    else if (seo.title.length > 0) score += 10;

    if (seo.description.length >= 120 && seo.description.length <= 160) score += 20;
    else if (seo.description.length > 0) score += 10;

    if (seo.keywords.split(',').length >= 4) score += 15;
    if (seo.canonicalUrl.startsWith('https://')) score += 15;
    if (seo.ogTitle && seo.ogImage) score += 15;
    if (seo.googleSiteVerification) score += 15;
    return score;
  };

  const seoScore = getSeoScore();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Advanced Search Engine Optimization (SEO) Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Rank #1 Ready
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">Configure search titles, meta tags, OpenGraph social previews, Google Search Console & Schema markup</p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4 shrink-0">
          <div className="relative flex items-center justify-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg ${seoScore >= 80 ? 'bg-emerald-100 text-emerald-700' : seoScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
              {seoScore}%
            </div>
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-extrabold text-slate-900">Google Ranking Health</div>
            <div className="text-[11px] font-medium text-slate-500">
              {seoScore >= 80 ? '🟢 Excellent SEO Optimization' : seoScore >= 50 ? '🟡 Good (Can be improved)' : '🔴 Needs Attention'}
            </div>
            <div className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View 6 Ranking Factors</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Google SERP Live Search Result Preview</h2>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>

        <div className={`p-4 bg-slate-50 border border-slate-200 rounded-2xl font-sans transition-all ${previewDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'}`}>
          <div className="flex items-center gap-2 text-xs mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">G</div>
            <span className="text-slate-800 font-semibold truncate">https://codeguru.in › {seo.slug || 'home'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug truncate">
            {seo.title || 'CodeGuru Academy - Software Training Institute'}
          </h3>
          <p className="text-xs text-[#4d5156] leading-relaxed mt-1 line-clamp-2">
            {seo.description || 'Enter meta description to preview how your page snippet will appear on Google search results.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Search className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900">1. Core Search Meta Tags</h2>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Global Meta Title (Title Tag)</label>
                <span className={`text-[10px] font-mono font-bold ${seo.title.length >= 40 && seo.title.length <= 60 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {seo.title.length} / 60 Chars
                </span>
              </div>
              <input
                type="text"
                value={seo.title}
                onChange={e => setSeo({...seo, title: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                placeholder="e.g. CodeGuru Academy - Best IT Training Institute in Pune"
              />
              <p className="text-[10px] text-slate-400 mt-1">Recommended length: 50–60 characters for maximum Google visibility.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Meta Description</label>
                <span className={`text-[10px] font-mono font-bold ${seo.description.length >= 120 && seo.description.length <= 160 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {seo.description.length} / 160 Chars
                </span>
              </div>
              <textarea
                rows="3"
                value={seo.description}
                onChange={e => setSeo({...seo, description: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-slate-700"
                placeholder="Summarize your website offerings in 120-160 characters..."
              />
              <p className="text-[10px] text-slate-400 mt-1">Include high-intent keywords like "Full Stack", "Placement", and city names.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Keywords (Comma Separated)</label>
              <textarea
                rows="2"
                value={seo.keywords}
                onChange={e => setSeo({...seo, keywords: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800 text-xs"
                placeholder="CodeGuru, Full Stack Course, Data Science Pune, MERN Stack"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={seo.canonicalUrl}
                  onChange={e => setSeo({...seo, canonicalUrl: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800 text-[11px]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">SEO Custom URL Slug</label>
                <input
                  type="text"
                  value={seo.slug}
                  onChange={e => setSeo({...seo, slug: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800 text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900">2. Social Media OpenGraph (OG) Meta Tags</h2>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="font-bold text-slate-700 block mb-1">OG Share Title (WhatsApp/FB/LinkedIn)</label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={e => setSeo({...seo, ogTitle: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">OG Social Description</label>
              <textarea
                rows="2"
                value={seo.ogDescription}
                onChange={e => setSeo({...seo, ogDescription: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">OG Social Banner Image URL</label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={e => setSeo({...seo, ogImage: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Twitter Card Display Format</label>
              <select
                value={seo.twitterCard}
                onChange={e => setSeo({...seo, twitterCard: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white font-semibold text-slate-800"
              >
                <option value="summary_large_image">Summary Card with Large Image (Recommended)</option>
                <option value="summary">Standard Summary Card</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-black text-slate-900">3. Google Search Console & Analytics Verification</h2>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Google Site Verification Tag Key</label>
              <input
                type="text"
                value={seo.googleSiteVerification}
                onChange={e => setSeo({...seo, googleSiteVerification: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                placeholder="google-site-verification=XXXXXXXX"
              />
              <p className="text-[10px] text-slate-400 mt-1">Connects website with Google Search Console for automated indexing.</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Google Analytics 4 (GA4) Tracking ID</label>
              <input
                type="text"
                value={seo.googleAnalyticsId}
                onChange={e => setSeo({...seo, googleAnalyticsId: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-black text-slate-900">4. Schema.org JSON-LD & Indexing Rules</h2>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="font-extrabold text-slate-900">Google Search Indexing (Robots)</div>
                <div className="text-[11px] text-slate-500">Allow search crawlers to index & follow page links</div>
              </div>
              <div className="flex items-center gap-3 font-extrabold">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.robotsIndex}
                    onChange={e => setSeo({...seo, robotsIndex: e.target.checked})}
                    className="accent-blue-600"
                  /> index
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seo.robotsFollow}
                    onChange={e => setSeo({...seo, robotsFollow: e.target.checked})}
                    className="accent-blue-600"
                  /> follow
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <div>
                <div className="font-extrabold text-indigo-950">Enable Structured Schema Markup (JSON-LD)</div>
                <div className="text-[11px] text-indigo-700">Show rich star ratings & educational institute badges on Google</div>
              </div>
              <input
                type="checkbox"
                checked={seo.enableSchema}
                onChange={e => setSeo({...seo, enableSchema: e.target.checked})}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Schema Organization Type</label>
              <select
                value={seo.schemaType}
                onChange={e => setSeo({...seo, schemaType: e.target.value})}
                className="w-full p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white font-semibold text-slate-800"
              >
                <option value="EducationalOrganization">Educational Organization (School / Institute)</option>
                <option value="LocalBusiness">Local Business (IT Academy / Training Center)</option>
                <option value="Course">Course / Educational Occupations</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
        <div className="space-y-0.5">
          <div className="font-black text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Save & Push SEO Config to Public Website
          </div>
          <div className="text-xs text-slate-400 font-semibold">Updates index meta tags, sitemap entries & Google Search Console verification</div>
        </div>
        <button
          onClick={() => alert('🚀 SEO Metadata & Google SERP Configuration Saved Successfully!')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Publish Live SEO Settings
        </button>
      </div>
    </div>
  );
}

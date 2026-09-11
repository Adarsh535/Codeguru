import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DISTRICT_PINS = [
  {
    id: 'lko',
    name: 'Lucknow City',
    state: 'Uttar Pradesh',
    badge: 'Capital HQ & Main Campus',
    x: 48,
    y: 44,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/25 border-teal-500/40'
  },
  {
    id: 'ayodhya',
    name: 'Ayodhya City',
    state: 'Uttar Pradesh',
    badge: 'Regional Branch Campus',
    x: 62,
    y: 46,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'kanpur',
    name: 'Kanpur City',
    state: 'Uttar Pradesh',
    badge: 'Industrial Tech Hub',
    x: 42,
    y: 52,
    color: 'coral',
    pinBg: 'bg-rose-500 text-white',
    rippleBg: 'bg-rose-500/20 border-rose-500/30'
  },
  {
    id: 'varanasi',
    name: 'Varanasi City',
    state: 'Uttar Pradesh',
    badge: 'Eastern UP Knowledge Hub',
    x: 74,
    y: 64,
    color: 'coral',
    pinBg: 'bg-rose-500 text-white',
    rippleBg: 'bg-rose-500/20 border-rose-500/30'
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj City',
    state: 'Uttar Pradesh',
    badge: 'Academic Student Zone',
    x: 58,
    y: 62,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'gorakhpur',
    name: 'Gorakhpur City',
    state: 'Uttar Pradesh',
    badge: 'North-East UP Hub',
    x: 72,
    y: 40,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'noida',
    name: 'Noida (Delhi NCR)',
    state: 'Delhi NCR / UP',
    badge: 'Corporate Tech Corridor',
    x: 18,
    y: 34,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'ghaziabad',
    name: 'Ghaziabad City',
    state: 'Delhi NCR / UP',
    badge: 'NCR Metro Zone',
    x: 22,
    y: 30,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'bareilly',
    name: 'Bareilly City',
    state: 'Uttar Pradesh',
    badge: 'Rohilkhand Region',
    x: 36,
    y: 30,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'agra',
    name: 'Agra City',
    state: 'Uttar Pradesh',
    badge: 'Western UP Metro',
    x: 28,
    y: 48,
    color: 'coral',
    pinBg: 'bg-rose-500 text-white',
    rippleBg: 'bg-rose-500/20 border-rose-500/30'
  },
  {
    id: 'meerut',
    name: 'Meerut City',
    state: 'Uttar Pradesh',
    badge: 'Western Tech Region',
    x: 24,
    y: 26,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'aligarh',
    name: 'Aligarh City',
    state: 'Uttar Pradesh',
    badge: 'University Region',
    x: 30,
    y: 40,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'mathura',
    name: 'Mathura City',
    state: 'Uttar Pradesh',
    badge: 'Braj Region Zone',
    x: 24,
    y: 44,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'moradabad',
    name: 'Moradabad City',
    state: 'Uttar Pradesh',
    badge: 'Northern UP Zone',
    x: 32,
    y: 24,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'jhansi',
    name: 'Jhansi City',
    state: 'Uttar Pradesh',
    badge: 'Bundelkhand Hub',
    x: 30,
    y: 66,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'sitapur',
    name: 'Sitapur City',
    state: 'Uttar Pradesh',
    badge: 'Avadh Region',
    x: 46,
    y: 38,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'sultanpur',
    name: 'Sultanpur City',
    state: 'Uttar Pradesh',
    badge: 'Avadh Region Zone',
    x: 60,
    y: 54,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  },
  {
    id: 'azamgarh',
    name: 'Azamgarh City',
    state: 'Uttar Pradesh',
    badge: 'Purvanchal Region',
    x: 76,
    y: 52,
    color: 'teal',
    pinBg: 'bg-teal-500 text-white',
    rippleBg: 'bg-teal-500/20 border-teal-500/30'
  }
];

export default function DistrictInquiryMap({ leads = [], compact = false }) {
  const [selectedDistrictId, setSelectedDistrictId] = useState('lko');
  const [mapQuery, setMapQuery] = useState('');
  const [mapZoom, setMapZoom] = useState(1);
  const [mapLayer, setMapLayer] = useState('vector'); // vector, carto

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate live lead statistics 100% from MongoDB server data
  const districts = DISTRICT_PINS.map(d => {
    const cityNameClean = d.name.toLowerCase().replace(' city', '').replace(' (delhi ncr)', '').trim();
    
    const matchingLeads = (leads || []).filter(l => 
      l.location && (
        l.location.toLowerCase().includes(cityNameClean) ||
        l.location.toLowerCase().includes(d.id)
      )
    );

    const todayLeads = matchingLeads.filter(l => {
      if (!l.createdAt) return false;
      const leadDate = new Date(l.createdAt).toISOString().split('T')[0];
      return leadDate === todayStr;
    });

    const latestLead = matchingLeads.length > 0 ? matchingLeads[0] : null;

    return {
      ...d,
      inquiries: matchingLeads.length,
      todayNew: todayLeads.length,
      latestStudent: latestLead ? latestLead.name : 'No Recent Lead',
      phone: latestLead ? latestLead.phone : '',
      topCourse: latestLead ? latestLead.course : 'General Inquiry'
    };
  });

  const selectedDistrict = districts.find(d => d.id === selectedDistrictId) || districts[0];

  const filteredDistricts = districts.filter(d => 
    !mapQuery || d.name.toLowerCase().includes(mapQuery.toLowerCase()) || d.badge.toLowerCase().includes(mapQuery.toLowerCase())
  );

  const totalRegionalInquiries = districts.reduce((acc, curr) => acc + curr.inquiries, 0);

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-metoxi flex flex-col overflow-hidden select-none ${compact ? 'border-none shadow-none rounded-2xl' : ''}`}>
      
      {/* HEADER BAR */}
      <div className={`p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white ${compact ? 'p-2 sm:p-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className={`font-black text-slate-800 tracking-tight font-heading uppercase ${compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}`}>
                UP CITIES & DISTRICTS MAP OVERVIEW
              </h2>
              <span className="text-[10px] sm:text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-mono">
                {districts.length} Cities
              </span>
            </div>
            {!compact && (
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Interactive Uttar Pradesh city location map showing student inquiry density and hub networks.
              </p>
            )}
          </div>
        </div>

        {/* SEARCH & LAYER CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <SearchIcon className="!w-4 !h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mapQuery}
              onChange={(e) => setMapQuery(e.target.value)}
              placeholder="Search city (e.g. Lucknow, Ayodhya)..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 outline-none focus:border-teal-500 transition-all w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setMapLayer(mapLayer === 'vector' ? 'carto' : 'vector')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <LayersIcon className="!w-4 !h-4 text-teal-600" />
            <span>{mapLayer === 'vector' ? 'Vector Map' : 'Satellite Carto'}</span>
          </button>
        </div>
      </div>

      {/* MAP CANVAS WITH ALL UP CITIES & DISTRICT PINS */}
      <div className={`relative w-full bg-[#e6ebf2] overflow-hidden ${
        compact ? 'h-[320px] sm:h-[360px]' : 'h-[440px] sm:h-[500px]'
      }`}>
        
        {/* LIGHT VECTOR MAP BASE TILES */}
        <div
          className="w-full h-full relative transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${mapZoom})`,
            transformOrigin: 'center center',
            backgroundImage: mapLayer === 'carto'
              ? `url('https://a.basemaps.cartocdn.com/light_all/7/77/47.png')`
              : `radial-gradient(circle at 50% 50%, #f1f5f9 0%, #e2e8f0 100%), repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(148,163,184,0.12) 35px, rgba(148,163,184,0.12) 36px), repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(148,163,184,0.12) 35px, rgba(148,163,184,0.12) 36px)`,
            backgroundSize: mapLayer === 'carto' ? 'cover' : 'auto'
          }}
        >
          {/* HIGHWAY NETWORKS CONNECTING ALL CITIES */}
          <svg className="w-full h-full opacity-70 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 18 34 L 22 30 L 24 26 L 32 24 L 36 30 L 48 44 L 62 46 L 72 40 L 76 52 L 74 64" fill="none" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="2,2" />
            <path d="M 28 48 L 42 52 L 48 44 L 58 62 L 74 64" fill="none" stroke="#2dd4bf" strokeWidth="0.7" />
            <path d="M 48 44 L 46 38" fill="none" stroke="#0d9488" strokeWidth="0.6" />
            <path d="M 62 46 L 60 54 L 58 62" fill="none" stroke="#0d9488" strokeWidth="0.6" />
            <path d="M 30 66 L 42 52" fill="none" stroke="#a855f7" strokeWidth="0.6" strokeDasharray="1,2" />

            {/* Ganga River Path */}
            <path d="M 18 28 Q 38 46, 58 62 T 88 76" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.6" />
          </svg>

          {/* ALL CITY MARKERS WITH CITY NAME & INQUIRY COUNT */}
          {filteredDistricts.map((d) => {
            const isSelected = selectedDistrict?.id === d.id;
            const isHub = d.id === 'lko';

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group transition-all duration-300"
              >
                {/* RADIAL MULTI-RING PULSE RIPPLE */}
                <div
                  className={`absolute rounded-full transition-all border ${d.rippleBg} ${
                    isHub ? 'w-24 h-24 -left-9 -top-9 animate-pulse' : 'w-14 h-14 -left-4 -top-4'
                  }`}
                />

                {/* CIRCULAR BADGE MARKER */}
                <div
                  className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all transform group-hover:scale-110 active:scale-95 ${
                    isSelected
                      ? 'scale-125 ring-4 ring-teal-300 shadow-teal-500/40 z-30'
                      : ''
                  } ${
                    d.color === 'coral'
                      ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white'
                      : 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-white'
                  }`}
                >
                  <LocationOnIcon className="!w-4.5 !h-4.5" />

                  {/* MINI INQUIRY NUMBER BADGE FLOATING AT TOP-RIGHT */}
                  <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                    {d.inquiries}
                  </span>
                </div>

                {/* CITY NAME LABEL UNDER PIN */}
                <div className={`mt-0.5 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold tracking-tight whitespace-nowrap shadow-2xs transition-all text-center ${
                  isSelected
                    ? 'bg-slate-900 text-white font-black scale-105'
                    : 'bg-white/95 text-slate-800 border border-slate-200/90 group-hover:bg-teal-600 group-hover:text-white'
                }`}>
                  {d.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* TOP LEFT OVERLAY: CITY COUNT STATUS */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-md text-xs font-bold text-slate-700 pointer-events-auto flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
            <span>Showing {districts.length} UP Cities & Towns</span>
          </div>
        </div>

        {/* BOTTOM RIGHT ZOOM & RE-CENTER CONTROLS */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-lg">
          <button
            onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomInIcon className="!w-4.5 !h-4.5" />
          </button>
          <button
            onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
            className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOutIcon className="!w-4.5 !h-4.5" />
          </button>
          <button
            onClick={() => { setMapZoom(1); setSelectedDistrictId('lko'); }}
            className="p-1.5 rounded-xl text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
            title="Re-Center Map"
          >
            <MyLocationIcon className="!w-4.5 !h-4.5" />
          </button>
        </div>

        {/* FLOATING SELECTED CITY DETAIL CARD */}
        {selectedDistrict && (
          <div className="absolute bottom-4 left-4 z-30 w-72 sm:w-80 bg-white/95 backdrop-blur-xl rounded-3xl p-4 border border-slate-200/90 shadow-2xl animate-modal-slide-up flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-2xl ${
                  selectedDistrict.color === 'coral' ? 'bg-rose-500' : 'bg-teal-500'
                } text-white flex items-center justify-center text-sm font-black shadow-xs shrink-0`}>
                  🏙️
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {selectedDistrict.name}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">
                    {selectedDistrict.state} • {selectedDistrict.badge}
                  </span>
                </div>
              </div>

              <span className="text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                {selectedDistrict.inquiries} Leads
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-slate-700 font-semibold pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Today's Inquiries:</span>
                <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.2 rounded-full">
                  +{selectedDistrict.todayNew} New Today
                </span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <SchoolIcon className="!w-4 !h-4 text-teal-600 shrink-0" />
                <span className="truncate font-bold text-slate-800">{selectedDistrict.topCourse}</span>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Recent Lead: <strong className="text-slate-900">{selectedDistrict.latestStudent}</strong></span>
                <a href={`tel:${selectedDistrict.phone}`} className="text-teal-600 font-black hover:underline flex items-center gap-0.5 text-xs">
                  <PhoneIcon className="!w-3 !h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM CITY CARDS GRID */}
      {!compact && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              All City & District Student Inquiry Counts ({districts.length} Cities)
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Total Regional Inquiries: {totalRegionalInquiries}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {districts.map((d) => {
              const isSelected = selectedDistrict?.id === d.id;

              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrictId(d.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1 active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-transparent shadow-md'
                      : 'bg-white hover:bg-teal-50/50 text-slate-800 border-slate-200/80 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[11px] font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {d.name.replace(' City', '')}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.3 rounded-full shrink-0 ${
                      isSelected ? 'bg-white text-teal-800' : 'bg-teal-50 text-teal-700 border border-teal-100'
                    }`}>
                      {d.inquiries}
                    </span>
                  </div>
                  <span className={`text-[9px] truncate ${isSelected ? 'text-teal-100 font-medium' : 'text-slate-400 font-normal'}`}>
                    {d.topCourse}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

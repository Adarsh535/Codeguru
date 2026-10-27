/**
 * ============================================================================
 * SEO LOCATIONS: UTTAR PRADESH + BIHAR DISTRICTS & AYODHYA AREA TOWNS
 * ============================================================================
 * Static location data for city landing pages. Course data on those pages
 * always comes live from the API; only city names / coordinates live here.
 * Coordinates are approximate district headquarters (used for distance only).
 */

export const CAMPUS = { lat: 26.7922, lng: 82.1998 };

// [slug, English name, Hindi name, lat, lng, type]
// type: 'area' = town inside Ayodhya district, 'district' = district HQ
const UP = [
  ['ayodhya', 'Ayodhya', 'अयोध्या', 26.7922, 82.1998],
  ['agra', 'Agra', 'आगरा', 27.18, 78.01],
  ['aligarh', 'Aligarh', 'अलीगढ़', 27.88, 78.08],
  ['ambedkar-nagar', 'Ambedkar Nagar', 'अंबेडकर नगर', 26.43, 82.54],
  ['amethi', 'Amethi', 'अमेठी', 26.21, 81.69],
  ['amroha', 'Amroha', 'अमरोहा', 28.9, 78.47],
  ['auraiya', 'Auraiya', 'औरैया', 26.47, 79.51],
  ['azamgarh', 'Azamgarh', 'आजमगढ़', 26.07, 83.19],
  ['baghpat', 'Baghpat', 'बागपत', 28.94, 77.22],
  ['bahraich', 'Bahraich', 'बहराइच', 27.57, 81.6],
  ['ballia', 'Ballia', 'बलिया', 25.76, 84.15],
  ['balrampur', 'Balrampur', 'बलरामपुर', 27.43, 82.18],
  ['banda', 'Banda', 'बांदा', 25.48, 80.33],
  ['barabanki', 'Barabanki', 'बाराबंकी', 26.93, 81.19],
  ['bareilly', 'Bareilly', 'बरेली', 28.37, 79.43],
  ['basti', 'Basti', 'बस्ती', 26.8, 82.73],
  ['bhadohi', 'Bhadohi', 'भदोही', 25.4, 82.57],
  ['bijnor', 'Bijnor', 'बिजनौर', 29.37, 78.14],
  ['budaun', 'Budaun', 'बदायूं', 28.03, 79.12],
  ['bulandshahr', 'Bulandshahr', 'बुलंदशहर', 28.41, 77.85],
  ['chandauli', 'Chandauli', 'चंदौली', 25.27, 83.27],
  ['chitrakoot', 'Chitrakoot', 'चित्रकूट', 25.2, 80.9],
  ['deoria', 'Deoria', 'देवरिया', 26.5, 83.78],
  ['etah', 'Etah', 'एटा', 27.56, 78.66],
  ['etawah', 'Etawah', 'इटावा', 26.78, 79.02],
  ['farrukhabad', 'Farrukhabad', 'फर्रुखाबाद', 27.39, 79.58],
  ['fatehpur', 'Fatehpur', 'फतेहपुर', 25.93, 80.81],
  ['firozabad', 'Firozabad', 'फिरोजाबाद', 27.15, 78.4],
  ['noida', 'Noida', 'नोएडा', 28.54, 77.39],
  ['ghaziabad', 'Ghaziabad', 'गाजियाबाद', 28.67, 77.45],
  ['ghazipur', 'Ghazipur', 'गाजीपुर', 25.58, 83.58],
  ['gonda', 'Gonda', 'गोंडा', 27.13, 81.96],
  ['gorakhpur', 'Gorakhpur', 'गोरखपुर', 26.76, 83.37],
  ['hamirpur', 'Hamirpur', 'हमीरपुर', 25.95, 80.15],
  ['hapur', 'Hapur', 'हापुड़', 28.73, 77.78],
  ['hardoi', 'Hardoi', 'हरदोई', 27.4, 80.13],
  ['hathras', 'Hathras', 'हाथरस', 27.6, 78.05],
  ['jalaun', 'Jalaun (Orai)', 'जालौन (उरई)', 25.99, 79.45],
  ['jaunpur', 'Jaunpur', 'जौनपुर', 25.75, 82.69],
  ['jhansi', 'Jhansi', 'झांसी', 25.45, 78.57],
  ['kannauj', 'Kannauj', 'कन्नौज', 27.06, 79.92],
  ['kanpur-dehat', 'Kanpur Dehat', 'कानपुर देहात', 26.42, 79.96],
  ['kanpur', 'Kanpur', 'कानपुर', 26.45, 80.33],
  ['kasganj', 'Kasganj', 'कासगंज', 27.81, 78.65],
  ['kaushambi', 'Kaushambi', 'कौशांबी', 25.53, 81.38],
  ['kushinagar', 'Kushinagar', 'कुशीनगर', 26.9, 83.98],
  ['lakhimpur-kheri', 'Lakhimpur Kheri', 'लखीमपुर खीरी', 27.95, 80.78],
  ['lalitpur', 'Lalitpur', 'ललितपुर', 24.69, 78.42],
  ['lucknow', 'Lucknow', 'लखनऊ', 26.85, 80.95],
  ['maharajganj', 'Maharajganj', 'महराजगंज', 27.14, 83.56],
  ['mahoba', 'Mahoba', 'महोबा', 25.29, 79.87],
  ['mainpuri', 'Mainpuri', 'मैनपुरी', 27.23, 79.02],
  ['mathura', 'Mathura', 'मथुरा', 27.49, 77.67],
  ['mau', 'Mau', 'मऊ', 25.94, 83.56],
  ['meerut', 'Meerut', 'मेरठ', 28.98, 77.71],
  ['mirzapur', 'Mirzapur', 'मिर्जापुर', 25.15, 82.57],
  ['moradabad', 'Moradabad', 'मुरादाबाद', 28.84, 78.77],
  ['muzaffarnagar', 'Muzaffarnagar', 'मुजफ्फरनगर', 29.47, 77.7],
  ['pilibhit', 'Pilibhit', 'पीलीभीत', 28.63, 79.8],
  ['pratapgarh', 'Pratapgarh', 'प्रतापगढ़', 25.9, 81.94],
  ['prayagraj', 'Prayagraj', 'प्रयागराज', 25.44, 81.85],
  ['raebareli', 'Raebareli', 'रायबरेली', 26.23, 81.23],
  ['rampur', 'Rampur', 'रामपुर', 28.8, 79.03],
  ['saharanpur', 'Saharanpur', 'सहारनपुर', 29.96, 77.55],
  ['sambhal', 'Sambhal', 'संभल', 28.58, 78.57],
  ['sant-kabir-nagar', 'Sant Kabir Nagar', 'संत कबीर नगर', 26.77, 83.07],
  ['shahjahanpur', 'Shahjahanpur', 'शाहजहांपुर', 27.88, 79.91],
  ['shamli', 'Shamli', 'शामली', 29.45, 77.31],
  ['shravasti', 'Shravasti', 'श्रावस्ती', 27.71, 81.93],
  ['siddharthnagar', 'Siddharthnagar', 'सिद्धार्थनगर', 27.28, 83.07],
  ['sitapur', 'Sitapur', 'सीतापुर', 27.57, 80.68],
  ['sonbhadra', 'Sonbhadra', 'सोनभद्र', 24.69, 83.07],
  ['sultanpur', 'Sultanpur', 'सुल्तानपुर', 26.26, 82.07],
  ['unnao', 'Unnao', 'उन्नाव', 26.55, 80.49],
  ['varanasi', 'Varanasi', 'वाराणसी', 25.32, 82.97]
];

const AYODHYA_AREAS = [
  ['faizabad', 'Faizabad', 'फैजाबाद', 26.77, 82.14],
  ['darshan-nagar', 'Darshan Nagar', 'दर्शन नगर', 26.77, 82.1],
  ['sohawal', 'Sohawal', 'सोहावल', 26.72, 81.98],
  ['bhadarsa', 'Bhadarsa', 'भदरसा', 26.66, 82.12],
  ['bikapur', 'Bikapur', 'बीकापुर', 26.59, 82.13],
  ['milkipur', 'Milkipur', 'मिल्कीपुर', 26.6, 81.91],
  ['kumarganj', 'Kumarganj', 'कुमारगंज', 26.53, 81.83],
  ['rudauli', 'Rudauli', 'रुदौली', 26.75, 81.75],
  ['goshainganj', 'Goshainganj', 'गोसाईंगंज', 26.57, 82.37],
  ['maya-bazar', 'Maya Bazar', 'मया बाजार', 26.68, 82.3]
];

const BIHAR = [
  ['patna', 'Patna', 'पटना', 25.59, 85.14],
  ['araria', 'Araria', 'अररिया', 26.15, 87.47],
  ['arwal', 'Arwal', 'अरवल', 25.25, 84.68],
  ['aurangabad-bihar', 'Aurangabad (Bihar)', 'औरंगाबाद (बिहार)', 24.75, 84.37],
  ['banka', 'Banka', 'बांका', 24.88, 86.92],
  ['begusarai', 'Begusarai', 'बेगूसराय', 25.42, 86.13],
  ['bhagalpur', 'Bhagalpur', 'भागलपुर', 25.24, 86.98],
  ['ara', 'Ara (Bhojpur)', 'आरा (भोजपुर)', 25.56, 84.66],
  ['buxar', 'Buxar', 'बक्सर', 25.56, 83.98],
  ['darbhanga', 'Darbhanga', 'दरभंगा', 26.15, 85.9],
  ['motihari', 'Motihari (East Champaran)', 'मोतिहारी (पूर्वी चंपारण)', 26.65, 84.92],
  ['gaya', 'Gaya', 'गया', 24.8, 85.0],
  ['gopalganj', 'Gopalganj', 'गोपालगंज', 26.47, 84.44],
  ['jamui', 'Jamui', 'जमुई', 24.92, 86.22],
  ['jehanabad', 'Jehanabad', 'जहानाबाद', 25.21, 84.99],
  ['bhabua', 'Bhabua (Kaimur)', 'भभुआ (कैमूर)', 25.04, 83.61],
  ['katihar', 'Katihar', 'कटिहार', 25.54, 87.57],
  ['khagaria', 'Khagaria', 'खगड़िया', 25.5, 86.48],
  ['kishanganj', 'Kishanganj', 'किशनगंज', 26.1, 87.95],
  ['lakhisarai', 'Lakhisarai', 'लखीसराय', 25.17, 86.09],
  ['madhepura', 'Madhepura', 'मधेपुरा', 25.92, 86.79],
  ['madhubani', 'Madhubani', 'मधुबनी', 26.35, 86.07],
  ['munger', 'Munger', 'मुंगेर', 25.38, 86.47],
  ['muzaffarpur', 'Muzaffarpur', 'मुजफ्फरपुर', 26.12, 85.39],
  ['bihar-sharif', 'Bihar Sharif (Nalanda)', 'बिहार शरीफ (नालंदा)', 25.2, 85.52],
  ['nawada', 'Nawada', 'नवादा', 24.89, 85.54],
  ['purnia', 'Purnia', 'पूर्णिया', 25.78, 87.47],
  ['sasaram', 'Sasaram (Rohtas)', 'सासाराम (रोहतास)', 24.95, 84.03],
  ['saharsa', 'Saharsa', 'सहरसा', 25.88, 86.6],
  ['samastipur', 'Samastipur', 'समस्तीपुर', 25.86, 85.78],
  ['chhapra', 'Chhapra (Saran)', 'छपरा (सारण)', 25.78, 84.73],
  ['sheikhpura', 'Sheikhpura', 'शेखपुरा', 25.14, 85.85],
  ['sheohar', 'Sheohar', 'शिवहर', 26.51, 85.29],
  ['sitamarhi', 'Sitamarhi', 'सीतामढ़ी', 26.59, 85.49],
  ['siwan', 'Siwan', 'सीवान', 26.22, 84.36],
  ['supaul', 'Supaul', 'सुपौल', 26.12, 86.6],
  ['hajipur', 'Hajipur (Vaishali)', 'हाजीपुर (वैशाली)', 25.69, 85.21],
  ['bettiah', 'Bettiah (West Champaran)', 'बेतिया (पश्चिमी चंपारण)', 26.8, 84.5]
];

const toRad = (deg) => (deg * Math.PI) / 180;

/** Straight-line distance in km, rounded up a little for road travel. */
export function roadKmFromCampus(lat, lng) {
  const dLat = toRad(lat - CAMPUS.lat);
  const dLng = toRad(lng - CAMPUS.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(CAMPUS.lat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  const straight = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((straight * 1.25) / 5) * 5;
}

const build = (rows, state, stateHi, type) =>
  rows.map(([slug, name, nameHi, lat, lng]) => ({
    slug,
    name,
    nameHi,
    state,
    stateHi,
    type: slug === 'ayodhya' ? 'campus' : type,
    lat,
    lng,
    km: roadKmFromCampus(lat, lng)
  }));

export const LOCATIONS = [
  ...build(UP, 'Uttar Pradesh', 'उत्तर प्रदेश', 'district'),
  ...build(AYODHYA_AREAS, 'Uttar Pradesh', 'उत्तर प्रदेश', 'area'),
  ...build(BIHAR, 'Bihar', 'बिहार', 'district')
];

const BY_SLUG = new Map(LOCATIONS.map((loc) => [loc.slug, loc]));

export const getLocation = (slug) => BY_SLUG.get(slug) || null;

/**
 * How a student from this place can realistically attend.
 * 'walkin'  : daily travel to the Ayodhya campus
 * 'hostel'  : stay near campus (PG/hostel) or weekend lab visits
 * 'online'  : live online batch + optional campus workshop
 */
export function attendMode(loc) {
  if (loc.km <= 45) return 'walkin';
  if (loc.km <= 160) return 'hostel';
  return 'online';
}

/** Nearest other locations, for internal links between city pages. */
export function nearbyLocations(loc, count = 6) {
  return LOCATIONS.filter((other) => other.slug !== loc.slug)
    .map((other) => ({ other, d: Math.hypot(other.lat - loc.lat, other.lng - loc.lng) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(({ other }) => other);
}

/**
 * ============================================================================
 * CONTROLLER: WEBSITE VISITOR ANALYTICS CONTROLLER (analyticsController.js)
 * ============================================================================
 * Handles privacy-conscious visitor tracking, active live sessions in MongoDB Atlas,
 * real-time SSE streams, accurate Indian Standard Time (IST, UTC+5:30) date boundaries,
 * and mathematically consistent unique visitor rollups across CodeGuru.
 */

import crypto from 'crypto';
import mongoose from 'mongoose';
import { PageView, ActiveSession, DailyMetric } from '../../models/Analytics.js';
import { cleanText } from '../../utils/sanitizeInput.js';
import { 
  getTodayKey, 
  getYesterdayKey, 
  getMonthStartKey, 
  getPastNDaysKeys, 
  getDateRangeKeys,
  getISTDayBoundaries,
  getISTRangeBoundaries
} from '../../utils/dateTime.js';
import { broadcastRealtimeEvent } from '../../services/realtimeService.js';

// Rate limiting & duplicate prevention store (per-process micro-cache)
const rateLimitMap = new Map();
const lastTrackedMap = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 1000;       // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

/**
 * Periodically clean up in-memory rate limit caches
 */
const cleanupRateLimitCaches = () => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }
  for (const [key, ts] of lastTrackedMap.entries()) {
    if (now - ts > 10 * 1000) {
      lastTrackedMap.delete(key);
    }
  }
};
setInterval(cleanupRateLimitCaches, 2 * 60 * 1000);

/**
 * Standard HTTP Cache-Control headers to strictly prevent stale browser/proxy caching
 */
const setNoCacheHeaders = (res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
};

/**
 * Generate privacy-preserving one-way hash of client IP
 */
const hashIp = (rawIp) => {
  if (!rawIp) return 'unknown';
  const salt = 'cg_analytics_salt_2026';
  return crypto.createHash('sha256').update(rawIp + salt).digest('hex').substring(0, 16);
};

/**
 * Detect search bots and scrapers from User-Agent
 */
const isBotUserAgent = (ua = '') => {
  if (!ua) return false;
  const botPattern = /bot|crawl|spider|slurp|facebookexternalhit|bingbot|googlebot|lighthouse|pingdom|headlesschrome|curl|wget|python|postman/i;
  return botPattern.test(ua);
};

/**
 * Categorize referrer URL into standard channels
 */
const categorizeReferrer = (referrer = '') => {
  if (!referrer || referrer.trim() === '' || referrer === 'Direct') return 'Direct';
  const lower = referrer.toLowerCase();
  if (lower.includes('google') || lower.includes('bing') || lower.includes('yahoo') || lower.includes('duckduckgo') || lower.includes('baidu')) {
    return 'Search';
  }
  if (lower.includes('instagram') || lower.includes('facebook') || lower.includes('linkedin') || lower.includes('twitter') || lower.includes('x.com') || lower.includes('youtube') || lower.includes('whatsapp') || lower.includes('t.co') || lower.includes('telegram')) {
    return 'Social';
  }
  return 'Referral';
};

// ============================================================================
// HIGH-PERFORMANCE IN-MEMORY CACHE, ACTIVE PRESENCE STORE & SSE SUBSCRIBERS
// ============================================================================
let cachedBaseMetrics = null;
let lastBaseCalculationTime = 0;
let lastCalculatedDay = '';
const BASE_CACHE_TTL_MS = 8000; // 8-second base metric TTL (invalidated instantly on new visit)

// Active sessions memory map for sub-millisecond live visitor lookups (<0.01ms)
const activeSessionsMemory = new Map(); // sessionId -> { visitorId, lastSeen, path, device }

export const updateActiveSessionMemory = (sessionId, visitorId, path, device) => {
  if (!sessionId || !visitorId) return;
  activeSessionsMemory.set(sessionId, {
    visitorId,
    path: path || '/',
    device: device || 'desktop',
    lastSeen: Date.now()
  });
};

export const removeActiveSessionMemory = (sessionId) => {
  if (sessionId) {
    activeSessionsMemory.delete(sessionId);
  }
};

// Report micro-cache (daily, top-pages, insights) to eliminate repeated heavy Mongo aggregations
const reportCache = new Map();
const REPORT_CACHE_TTL_MS = 6000; // 6 seconds

const getCachedReport = (key) => {
  const entry = reportCache.get(key);
  if (entry && (Date.now() - entry.time < REPORT_CACHE_TTL_MS)) {
    return entry.data;
  }
  return null;
};

const setCachedReport = (key, data) => {
  reportCache.set(key, { time: Date.now(), data });
  if (reportCache.size > 100) {
    const oldestKey = reportCache.keys().next().value;
    reportCache.delete(oldestKey);
  }
};

/**
 * Invalidate the cache immediately when new visits or events are recorded
 */
export const invalidateAnalyticsCache = () => {
  lastBaseCalculationTime = 0;
  reportCache.clear();
};

// Active Server-Sent Events subscribers for instant live push
const activeAnalyticsStreams = new Set();

/**
 * Broadcast instant live analytics update to all connected admin stream subscribers
 */
export const broadcastAnalyticsUpdate = async () => {
  if (activeAnalyticsStreams.size === 0) return;
  try {
    const stats = await getUnifiedAnalyticsSnapshot();
    const payload = `data: ${JSON.stringify({ type: 'update', data: stats })}\n\n`;
    for (const client of activeAnalyticsStreams) {
      try {
        client.write(payload);
      } catch {
        activeAnalyticsStreams.delete(client);
      }
    }
  } catch (err) {}
};

/**
 * Helper: Query live unique visitors count from active_sessions in Memory & MongoDB
 * 50-second active window (pairs with 8s client heartbeat) for rock-solid real-time accuracy.
 */
export const getLiveVisitorsCount = async () => {
  const now = Date.now();
  const thresholdMs = now - 50 * 1000;

  // 1. Fast in-memory evaluation
  const activeVisitorSet = new Set();
  for (const [sid, sess] of activeSessionsMemory.entries()) {
    if (sess.lastSeen >= thresholdMs) {
      activeVisitorSet.add(sess.visitorId);
    } else if (now - sess.lastSeen > 120 * 1000) {
      activeSessionsMemory.delete(sid);
    }
  }

  if (activeVisitorSet.size > 0) {
    return activeVisitorSet.size;
  }

  // 2. Fallback to MongoDB index
  try {
    const thresholdDate = new Date(thresholdMs);
    const distinctVisitors = await ActiveSession.distinct('visitorId', { 
      lastSeen: { $gte: thresholdDate } 
    });
    return distinctVisitors.length;
  } catch (err) {
    console.error('[getLiveVisitorsCount Error]:', err.message);
    return 0;
  }
};

/**
 * Unified Analytics Metric Engine (Optimized for 1-second ultra-fast live polling)
 * Generates identical, synchronized numbers for today, yesterday, monthly, all-time, and live visitors.
 * All day boundaries are strictly calculated in IST (Asia/Kolkata, UTC+5:30).
 */
export const getUnifiedAnalyticsSnapshot = async () => {
  const todayDate = getTodayKey();
  const yesterdayDate = getYesterdayKey();
  const monthStartDate = getMonthStartKey();
  const now = Date.now();

  let base = cachedBaseMetrics;

  // Re-aggregate heavy historical metrics only if cache expired or day flipped
  if (
    !base ||
    lastCalculatedDay !== todayDate ||
    (now - lastBaseCalculationTime > BASE_CACHE_TTL_MS)
  ) {
    const { start: todayStart, end: todayEnd } = getISTDayBoundaries(todayDate);
    const { start: yestStart, end: yestEnd } = getISTDayBoundaries(yesterdayDate);
    const { start: monthStart } = getISTDayBoundaries(monthStartDate);

    // Parallel execution across MongoDB
    const [
      todayVisitorsList,
      todayPageViews,
      yesterdayVisitorsList,
      yesterdayPageViews,
      monthVisitorsList,
      totalVisitorsList,
      totalPageViewsAllTime
    ] = await Promise.all([
      // Today's Unique Visitors
      PageView.distinct('visitorId', {
        $or: [
          { date: todayDate },
          { timestamp: { $gte: todayStart, $lte: todayEnd } }
        ]
      }),
      // Today's Page Views
      PageView.countDocuments({
        $or: [
          { date: todayDate },
          { timestamp: { $gte: todayStart, $lte: todayEnd } }
        ]
      }),
      // Yesterday's Unique Visitors
      PageView.distinct('visitorId', {
        $or: [
          { date: yesterdayDate },
          { timestamp: { $gte: yestStart, $lte: yestEnd } }
        ]
      }),
      // Yesterday's Page Views
      PageView.countDocuments({
        $or: [
          { date: yesterdayDate },
          { timestamp: { $gte: yestStart, $lte: yestEnd } }
        ]
      }),
      // This Month's Unique Visitors
      PageView.distinct('visitorId', {
        $or: [
          { date: { $gte: monthStartDate, $lte: todayDate } },
          { timestamp: { $gte: monthStart, $lte: todayEnd } }
        ]
      }),
      // Total Unique Visitors All Time
      PageView.distinct('visitorId'),
      // Total Page Views All Time
      PageView.countDocuments()
    ]);

    let todayVisitors = todayVisitorsList.length;
    let yesterdayVisitors = yesterdayVisitorsList.length;
    let thisMonthVisitors = monthVisitorsList.length;
    let totalVisitors = totalVisitorsList.length;

    // MATHEMATICAL INVARIANT CONSISTENCY GUARD
    if (todayVisitors > totalVisitors) totalVisitors = todayVisitors;
    if (yesterdayVisitors > totalVisitors) totalVisitors = yesterdayVisitors;
    if (thisMonthVisitors > totalVisitors) totalVisitors = thisMonthVisitors;

    // Calculate percentage changes
    let visitorGrowthPct = 0;
    if (yesterdayVisitors > 0) {
      visitorGrowthPct = Math.round(((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100);
    } else if (todayVisitors > 0) {
      visitorGrowthPct = 100;
    }

    let viewsGrowthPct = 0;
    if (yesterdayPageViews > 0) {
      viewsGrowthPct = Math.round(((todayPageViews - yesterdayPageViews) / yesterdayPageViews) * 100);
    } else if (todayPageViews > 0) {
      viewsGrowthPct = 100;
    }

    base = {
      todayVisitors,
      todayPageViews,
      yesterdayVisitors,
      yesterdayPageViews,
      thisMonthVisitors,
      totalVisitors,
      totalPageViews: totalPageViewsAllTime,
      visitorGrowthPct,
      viewsGrowthPct,
      todayDate,
      yesterdayDate,
      monthStartDate
    };

    cachedBaseMetrics = base;
    lastBaseCalculationTime = now;
    lastCalculatedDay = todayDate;
  }

  // Live active visitors is always queried fresh in real time (<2ms)
  const liveVisitorsCount = await getLiveVisitorsCount();

  return {
    ...base,
    liveVisitors: liveVisitorsCount,
    timestamp: new Date().toISOString()
  };
};

/**
 * @route   POST /api/analytics/track
 * @desc    Record page view event from public website
 * @access  Public
 */
export const trackPageView = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || '127.0.0.1';
    const ipHash = hashIp(rawIp);
    const userAgent = req.headers['user-agent'] || '';

    const {
      visitorId,
      sessionId,
      path = '/',
      url = '',
      title = 'CodeGurru',
      referrer = 'Direct',
      device = 'desktop',
      browser = 'Other',
      os = 'Other',
      isBot = false,
      isHeartbeat = false
    } = req.body || {};

    if (!visitorId || typeof visitorId !== 'string') {
      return res.status(400).json({ success: false, message: 'visitorId is required' });
    }

    const cleanVisitorId = visitorId.trim().substring(0, 64);
    const cleanSessionId = (sessionId || cleanVisitorId).toString().trim().substring(0, 64);
    const cleanPath = (path || '/').split('?')[0].trim().substring(0, 200) || '/';
    const safeDevice = ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop';

    // 1. Filter out bots and admin/dashboard page visits
    if (isBot || isBotUserAgent(userAgent)) {
      return res.json({ success: true, filtered: 'bot' });
    }
    if (cleanPath.startsWith('/admin') || cleanPath.startsWith('/dashboard') || cleanPath.startsWith('/login')) {
      return res.json({ success: true, filtered: 'admin_path' });
    }

    // 2. Upsert active session in Memory and MongoDB Atlas for instant live visitor tracking
    updateActiveSessionMemory(cleanSessionId, cleanVisitorId, cleanPath, safeDevice);
    ActiveSession.updateOne(
      { sessionId: cleanSessionId },
      { 
        $set: { 
          visitorId: cleanVisitorId, 
          path: cleanPath, 
          device: safeDevice, 
          lastSeen: new Date() 
        } 
      },
      { upsert: true }
    ).catch(() => {});

    // If pure heartbeat, return immediately
    if (isHeartbeat) {
      return res.json({ success: true, live: true });
    }

    const now = Date.now();

    // 3. Rate limiting protection
    const rateLimitKey = `${cleanVisitorId}_${ipHash}`;
    const rateRecord = rateLimitMap.get(rateLimitKey);
    if (rateRecord) {
      if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateRecord.count >= MAX_REQUESTS_PER_MINUTE) {
          return res.json({ success: true, throttled: true });
        }
        rateRecord.count += 1;
      } else {
        rateLimitMap.set(rateLimitKey, { timestamp: now, count: 1 });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { timestamp: now, count: 1 });
    }

    // 4. Deduplication protection against React StrictMode & double rendering
    const dedupKey = `${cleanVisitorId}_${cleanPath}`;
    const lastTrackedTime = lastTrackedMap.get(dedupKey);
    if (lastTrackedTime && (now - lastTrackedTime < 3000)) {
      return res.json({ success: true, deduplicated: true });
    }
    lastTrackedMap.set(dedupKey, now);

    // 5. IST Date formatting
    const todayDate = getTodayKey();
    const referrerCategory = categorizeReferrer(referrer);

    // Check if visitor has visited before (New vs Returning)
    const previousVisitCount = await PageView.countDocuments({ visitorId: cleanVisitorId });
    const isNewVisitor = previousVisitCount === 0;

    // 6. Save granular PageView event
    await PageView.create({
      visitorId: cleanVisitorId,
      sessionId: cleanSessionId,
      path: cleanPath,
      url: cleanText(url || cleanPath).substring(0, 300),
      title: (cleanText(title) || 'CodeGurru').substring(0, 150),
      referrer: (cleanText(referrer) || 'Direct').substring(0, 200),
      referrerCategory,
      device: safeDevice,
      browser: (browser || 'Other').substring(0, 50),
      os: (os || 'Other').substring(0, 50),
      ipHash,
      date: todayDate,
      isNewVisitor,
      timestamp: new Date()
    });

    // 7. Update DailyMetric summary atomically
    const incObj = {
      totalPageViews: 1,
      [`${safeDevice}Views`]: 1
    };
    if (isNewVisitor) {
      incObj.newVisitorsCount = 1;
    } else {
      incObj.returningVisitorsCount = 1;
    }

    await DailyMetric.findOneAndUpdate(
      { date: todayDate },
      { $inc: incObj },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Instant real-time live notification
    invalidateAnalyticsCache();
    broadcastAnalyticsUpdate();
    broadcastRealtimeEvent('traffic');

    return res.json({ success: true });
  } catch (err) {
    console.error('[analyticsController trackPageView Error]:', err.message);
    return res.status(200).json({ success: false, error: err.message });
  }
};

/**
 * @route   POST /api/analytics/heartbeat
 * @desc    Keep active session alive in active_sessions collection
 * @access  Public
 */
export const recordHeartbeat = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const { visitorId, sessionId, path = '/', device = 'desktop', isBot = false } = req.body || {};
    const userAgent = req.headers['user-agent'] || '';

    if (!visitorId || !sessionId) {
      return res.status(400).json({ success: false, message: 'visitorId and sessionId are required' });
    }

    const cleanPath = (path || '/').split('?')[0].trim().substring(0, 200) || '/';
    if (isBot || isBotUserAgent(userAgent) || cleanPath.startsWith('/admin') || cleanPath.startsWith('/dashboard')) {
      return res.json({ success: true, filtered: true });
    }

    const cleanVisitorId = visitorId.trim().substring(0, 64);
    const cleanSessionId = sessionId.trim().substring(0, 64);
    const safeDevice = ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop';

    updateActiveSessionMemory(cleanSessionId, cleanVisitorId, cleanPath, safeDevice);
    ActiveSession.updateOne(
      { sessionId: cleanSessionId },
      { 
        $set: { 
          visitorId: cleanVisitorId, 
          path: cleanPath, 
          device: safeDevice, 
          lastSeen: new Date() 
        } 
      },
      { upsert: true }
    ).catch(() => {});

    // Instant broadcast
    broadcastAnalyticsUpdate();
    broadcastRealtimeEvent('traffic');

    return res.json({ success: true, live: true });
  } catch (err) {
    console.error('[analyticsController recordHeartbeat Error]:', err.message);
    return res.status(200).json({ success: false });
  }
};

/**
 * @route   POST /api/analytics/leave
 * @desc    Remove closed tab/session immediately from active_sessions
 * @access  Public (called via navigator.sendBeacon or unload)
 */
export const recordLeave = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    let payload = req.body;
    // Parse beacon string payload if needed
    if (typeof req.body === 'string') {
      try {
        payload = JSON.parse(req.body);
      } catch (e) {
        payload = {};
      }
    }

    const { sessionId } = payload || {};
    if (sessionId) {
      const cleanSid = sessionId.toString().trim();
      removeActiveSessionMemory(cleanSid);
      await ActiveSession.deleteOne({ sessionId: cleanSid }).catch(() => {});
    }

    // Instant cache invalidation & live notification
    invalidateAnalyticsCache();
    broadcastAnalyticsUpdate();
    broadcastRealtimeEvent('traffic');

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: true });
  }
};

/**
 * @route   GET /api/analytics/summary
 * @desc    Get top summary statistics for Admin Dashboard cards
 * @access  Admin Private
 */
export const getAnalyticsSummary = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const data = await getUnifiedAnalyticsSnapshot();
    return res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('[analyticsController getAnalyticsSummary Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/daily
 * @desc    Get daily trend points for interactive line/bar chart
 * @access  Admin Private
 */
export const getDailyAnalytics = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const { range = '7d', startDate, endDate, grouping = 'daily' } = req.query;
    const cacheKey = `daily_${range}_${startDate || ''}_${endDate || ''}_${grouping}`;
    const cachedData = getCachedReport(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, fromCache: true });
    }
    let dateKeys = [];

    if (range === 'custom' && startDate && endDate) {
      dateKeys = getDateRangeKeys(startDate, endDate);
    } else if (range === '30d') {
      dateKeys = getPastNDaysKeys(30);
    } else if (range === 'thisMonth') {
      const monthStart = getMonthStartKey();
      const today = getTodayKey();
      dateKeys = getDateRangeKeys(monthStart, today);
    } else {
      dateKeys = getPastNDaysKeys(7);
    }

    if (dateKeys.length === 0) {
      dateKeys = getPastNDaysKeys(7);
    }

    const firstKey = dateKeys[0];
    const lastKey = dateKeys[dateKeys.length - 1];
    const { start: rangeStartDate } = getISTDayBoundaries(firstKey);
    const { end: rangeEndDate } = getISTDayBoundaries(lastKey);

    const matchFilter = {
      $or: [
        { date: { $in: dateKeys } },
        { timestamp: { $gte: rangeStartDate, $lte: rangeEndDate } }
      ]
    };

    // MongoDB Aggregation using Asia/Kolkata timezone
    const aggResults = await PageView.aggregate([
      { $match: matchFilter },
      {
        $project: {
          visitorId: 1,
          istDate: {
            $ifNull: [
              '$date',
              {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$timestamp',
                  timezone: 'Asia/Kolkata'
                }
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$istDate',
          pageViews: { $sum: 1 },
          visitorsSet: { $addToSet: '$visitorId' }
        }
      }
    ]);

    // Build map of aggregated daily results
    const dataMap = new Map();
    aggResults.forEach(item => {
      dataMap.set(item._id, {
        pageViews: item.pageViews,
        uniqueVisitors: item.visitorsSet.length
      });
    });

    // Populate full timeline ensuring zero counts for empty days
    const dailyPoints = dateKeys.map(dKey => {
      const item = dataMap.get(dKey) || { pageViews: 0, uniqueVisitors: 0 };
      const dateObj = new Date(`${dKey}T12:00:00+05:30`);
      const dayName = isNaN(dateObj.getTime()) ? dKey : dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' });
      const formattedDate = isNaN(dateObj.getTime()) ? dKey : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' });

      return {
        date: dKey,
        label: `${dayName}, ${formattedDate}`,
        shortLabel: formattedDate,
        dayOfWeek: dayName,
        pageViews: item.pageViews,
        uniqueVisitors: item.uniqueVisitors
      };
    });

    // Grouping: weekly or monthly
    let chartData = dailyPoints;
    if (grouping === 'weekly' && dailyPoints.length > 7) {
      const weeklyBuckets = [];
      for (let i = 0; i < dailyPoints.length; i += 7) {
        const slice = dailyPoints.slice(i, i + 7);
        const totalViews = slice.reduce((sum, p) => sum + p.pageViews, 0);
        const totalVisitors = slice.reduce((sum, p) => sum + p.uniqueVisitors, 0);
        weeklyBuckets.push({
          date: slice[0].date,
          label: `Week of ${slice[0].shortLabel}`,
          shortLabel: slice[0].shortLabel,
          pageViews: totalViews,
          uniqueVisitors: totalVisitors
        });
      }
      chartData = weeklyBuckets;
    } else if (grouping === 'monthly') {
      const monthMap = new Map();
      dailyPoints.forEach(p => {
        const mKey = p.date.substring(0, 7); // YYYY-MM
        const existing = monthMap.get(mKey) || { pageViews: 0, uniqueVisitors: 0 };
        monthMap.set(mKey, {
          pageViews: existing.pageViews + p.pageViews,
          uniqueVisitors: existing.uniqueVisitors + p.uniqueVisitors
        });
      });
      chartData = Array.from(monthMap.entries()).map(([mKey, vals]) => ({
        date: mKey,
        label: new Date(`${mKey}-01T12:00:00+05:30`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }),
        shortLabel: new Date(`${mKey}-01T12:00:00+05:30`).toLocaleDateString('en-US', { month: 'short', timeZone: 'Asia/Kolkata' }),
        pageViews: vals.pageViews,
        uniqueVisitors: vals.uniqueVisitors
      }));
    }

    // CRITICAL MATHEMATICAL FIX:
    // Period total unique visitors MUST BE the distinct visitorId set across the entire period,
    // NEVER the simple sum of daily uniques (which inflates the number when users return across days)!
    const [periodDistinctVisitors, allTimeTotalVisitors] = await Promise.all([
      PageView.distinct('visitorId', matchFilter),
      PageView.distinct('visitorId')
    ]);

    const totalViewsInPeriod = dailyPoints.reduce((sum, p) => sum + p.pageViews, 0);
    let totalVisitorsInPeriod = periodDistinctVisitors.length;
    const allTimeCount = allTimeTotalVisitors.length;

    // Mathematical consistency check: Period uniques can never exceed All-Time total
    if (totalVisitorsInPeriod > allTimeCount) {
      console.warn(`[Analytics Consistency Guard] Period uniques (${totalVisitorsInPeriod}) > All-time (${allTimeCount}). Normalizing.`);
      totalVisitorsInPeriod = allTimeCount;
    }

    const finalDaily = {
      range,
      grouping,
      points: chartData,
      rawDailyPoints: dailyPoints,
      totals: {
        pageViews: totalViewsInPeriod,
        uniqueVisitors: totalVisitorsInPeriod,
        avgViewsPerDay: dailyPoints.length > 0 ? Math.round(totalViewsInPeriod / dailyPoints.length) : 0,
        avgVisitorsPerDay: dailyPoints.length > 0 ? Math.round(totalVisitorsInPeriod / dailyPoints.length) : 0
      }
    };
    setCachedReport(cacheKey, finalDaily);
    return res.json({
      success: true,
      data: finalDaily
    });
  } catch (err) {
    console.error('[analyticsController getDailyAnalytics Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/top-pages
 * @desc    Get top visited pages report filtered by date range
 * @access  Admin Private
 */
export const getTopPages = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const { range = '7d', startDate, endDate, limit = 10 } = req.query;
    const cacheKey = `topPages_${range}_${startDate || ''}_${endDate || ''}_${limit}`;
    const cachedData = getCachedReport(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, fromCache: true });
    }
    let matchFilter = {};

    if (range === 'today') {
      const today = getTodayKey();
      const { start, end } = getISTDayBoundaries(today);
      matchFilter = { $or: [{ date: today }, { timestamp: { $gte: start, $lte: end } }] };
    } else if (range === 'yesterday') {
      const yesterday = getYesterdayKey();
      const { start, end } = getISTDayBoundaries(yesterday);
      matchFilter = { $or: [{ date: yesterday }, { timestamp: { $gte: start, $lte: end } }] };
    } else if (range === '30d') {
      const keys = getPastNDaysKeys(30);
      const { start } = getISTDayBoundaries(keys[0]);
      const { end } = getISTDayBoundaries(keys[keys.length - 1]);
      matchFilter = { $or: [{ date: { $in: keys } }, { timestamp: { $gte: start, $lte: end } }] };
    } else if (range === 'custom' && startDate && endDate) {
      const keys = getDateRangeKeys(startDate, endDate);
      const { start } = getISTDayBoundaries(keys[0]);
      const { end } = getISTDayBoundaries(keys[keys.length - 1]);
      matchFilter = { $or: [{ date: { $in: keys } }, { timestamp: { $gte: start, $lte: end } }] };
    } else if (range === 'all') {
      matchFilter = {};
    } else {
      const keys = getPastNDaysKeys(7);
      const { start } = getISTDayBoundaries(keys[0]);
      const { end } = getISTDayBoundaries(keys[keys.length - 1]);
      matchFilter = { $or: [{ date: { $in: keys } }, { timestamp: { $gte: start, $lte: end } }] };
    }

    const totalViewsInRange = await PageView.countDocuments(matchFilter);

    const aggResults = await PageView.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$path',
          pageViews: { $sum: 1 },
          visitorsSet: { $addToSet: '$visitorId' },
          latestTitle: { $last: '$title' }
        }
      },
      { $sort: { pageViews: -1 } },
      { $limit: parseInt(limit, 10) || 10 }
    ]);

    const formattedPages = aggResults.map(p => {
      const views = p.pageViews;
      const uniqueVisitors = p.visitorsSet.length;
      const percentage = totalViewsInRange > 0 ? Math.round((views / totalViewsInRange) * 1000) / 10 : 0;
      
      let friendlyName = p.latestTitle || p._id;
      if (p._id === '/') friendlyName = 'Home Page';
      else if (p._id === '/courses') friendlyName = 'Courses Catalog';
      else if (p._id === '/placements') friendlyName = 'Placement Record';
      else if (p._id === '/profile') friendlyName = 'Student Profile';
      else if (p._id === '/my-batch') friendlyName = 'My Batch';

      return {
        path: p._id,
        name: friendlyName,
        pageViews: views,
        uniqueVisitors: uniqueVisitors,
        percentage
      };
    });

    const finalPages = {
      totalViews: totalViewsInRange,
      pages: formattedPages
    };
    setCachedReport(cacheKey, finalPages);
    return res.json({
      success: true,
      data: finalPages
    });
  } catch (err) {
    console.error('[analyticsController getTopPages Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/realtime
 * @desc    Get live active visitors currently browsing the website from MongoDB Atlas
 * @access  Admin Private
 */
export const getRealtimeAnalytics = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const threshold = new Date(Date.now() - 60 * 1000);
    const activeList = await ActiveSession.find({ lastSeen: { $gte: threshold } }).lean();

    // Group unique visitors (1 user with multiple tabs = 1 live visitor)
    const distinctVisitorIds = new Set(activeList.map(s => s.visitorId));
    const liveCount = distinctVisitorIds.size;

    const pageCounts = {};
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };

    activeList.forEach(session => {
      pageCounts[session.path] = (pageCounts[session.path] || 0) + 1;
      if (deviceCounts[session.device] !== undefined) {
        deviceCounts[session.device] += 1;
      }
    });

    const activePages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    return res.json({
      success: true,
      data: {
        liveVisitors: liveCount,
        activePages,
        devices: deviceCounts,
        recentActiveCount: activeList.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[analyticsController getRealtimeAnalytics Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/insights
 * @desc    Get visitor insights (devices, new vs returning, day-of-week, referrers)
 * @access  Admin Private
 */
export const getVisitorInsights = async (req, res) => {
  setNoCacheHeaders(res);
  try {
    const { range = '30d' } = req.query;
    const cacheKey = `insights_${range}`;
    const cachedData = getCachedReport(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, fromCache: true });
    }
    const dateKeys = range === '7d' ? getPastNDaysKeys(7) : getPastNDaysKeys(30);

    const { start } = getISTDayBoundaries(dateKeys[0]);
    const { end } = getISTDayBoundaries(dateKeys[dateKeys.length - 1]);
    const matchFilter = {
      $or: [
        { date: { $in: dateKeys } },
        { timestamp: { $gte: start, $lte: end } }
      ]
    };

    // 1. Device distribution
    const deviceAgg = await PageView.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);

    const deviceMap = { desktop: 0, mobile: 0, tablet: 0 };
    deviceAgg.forEach(d => {
      if (d._id && deviceMap[d._id] !== undefined) {
        deviceMap[d._id] = d.count;
      }
    });

    // 2. New vs Returning Visitors
    const [newCount, returningCount] = await Promise.all([
      PageView.countDocuments({ ...matchFilter, isNewVisitor: true }),
      PageView.countDocuments({ ...matchFilter, isNewVisitor: false })
    ]);

    // 3. Traffic by Referrer Channel
    const referrerAgg = await PageView.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$referrerCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Traffic by Day of the Week in Asia/Kolkata timezone
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    const dayOfWeekAgg = await PageView.aggregate([
      { $match: matchFilter },
      {
        $project: {
          dayOfWeek: {
            $dayOfWeek: {
              date: '$timestamp',
              timezone: 'Asia/Kolkata'
            }
          }
        }
      },
      {
        $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 }
        }
      }
    ]);

    // $dayOfWeek returns 1 for Sunday, 2 for Monday, ..., 7 for Saturday
    dayOfWeekAgg.forEach(item => {
      if (item._id >= 1 && item._id <= 7) {
        const dName = daysOfWeek[item._id - 1];
        dayCounts[dName] = item.count;
      }
    });

    const finalInsights = {
      devices: deviceMap,
      visitors: {
        newVisitors: newCount,
        returningVisitors: returningCount,
        total: newCount + returningCount
      },
      referrers: referrerAgg.map(r => ({
        channel: r._id || 'Direct',
        count: r.count
      })),
      dayOfWeek: daysOfWeek.map(d => ({
        day: d,
        views: dayCounts[d]
      }))
    };
    setCachedReport(cacheKey, finalInsights);
    return res.json({
      success: true,
      data: finalInsights
    });
  } catch (err) {
    console.error('[analyticsController getVisitorInsights Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/stream
 * @desc    Server-Sent Events (SSE) stream pushing latest live statistics every 1 second
 *          with automatic MongoDB change detection and instant broadcast
 * @access  Admin Private
 */
export const streamAnalytics = async (req, res) => {
  // Configure Server-Sent Events headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform, no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering in Nginx
  res.flushHeaders?.();

  let isAlive = true;
  activeAnalyticsStreams.add(res);

  const sendEvent = (eventData) => {
    if (!isAlive) return;
    try {
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    } catch (e) {
      isAlive = false;
      activeAnalyticsStreams.delete(res);
    }
  };

  // Push immediate initial snapshot upon connecting
  try {
    const initialStats = await getUnifiedAnalyticsSnapshot();
    sendEvent({ type: 'snapshot', data: initialStats });
  } catch (err) {
    console.warn('[streamAnalytics Initial Push Error]:', err.message);
  }

  // Periodic push every 1 second (1000ms) for high-frequency live real-time updates
  const intervalId = setInterval(async () => {
    if (!isAlive) {
      clearInterval(intervalId);
      activeAnalyticsStreams.delete(res);
      return;
    }
    try {
      const stats = await getUnifiedAnalyticsSnapshot();
      sendEvent({ type: 'update', data: stats });
    } catch (err) {
      // Continue next tick
    }
  }, 1000);

  // Bonus: Watch active_sessions via MongoDB Change Stream if supported by replica set (Atlas)
  let changeStream = null;
  try {
    if (mongoose.connection.readyState === 1 && typeof ActiveSession.watch === 'function') {
      changeStream = ActiveSession.watch();
      changeStream.on('change', async () => {
        if (!isAlive) return;
        try {
          const stats = await getUnifiedAnalyticsSnapshot();
          sendEvent({ type: 'update', data: stats });
        } catch (err) {}
      });
    }
  } catch (e) {
    // Change streams are not available on local single-node mongodb, 1s interval is primary
  }

  req.on('close', () => {
    isAlive = false;
    activeAnalyticsStreams.delete(res);
    clearInterval(intervalId);
    if (changeStream) {
      changeStream.close().catch(() => {});
    }
    res.end();
  });
};

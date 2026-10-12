/**
 * ============================================================================
 * CONTROLLER: WEBSITE VISITOR ANALYTICS CONTROLLER (analyticsController.js)
 * ============================================================================
 * Handles privacy-conscious visitor tracking, live sessions, daily trends,
 * top pages reports, and device/referrer insights with accurate IST date boundaries.
 */

import crypto from 'crypto';
import { PageView, DailyMetric } from '../../models/Analytics.js';
import { 
  getTodayKey, 
  getYesterdayKey, 
  getMonthStartKey, 
  getPastNDaysKeys, 
  getDateRangeKeys 
} from '../../utils/dateTime.js';

// In-memory active visitor sessions store: visitorId -> { lastSeen: number, path: string, device: string, sessionId: string }
const liveVisitorsMap = new Map();

// Rate limiting & duplicate prevention store: key -> { timestamp: number, count: number }
const rateLimitMap = new Map();
const lastTrackedMap = new Map();

// Cleanup intervals
const LIVE_SESSION_CUTOFF_MS = 5 * 60 * 1000; // 5 minutes inactivity window
const RATE_LIMIT_WINDOW_MS = 60 * 1000;       // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

/**
 * Clean up expired active visitor sessions and rate-limit caches
 */
const cleanupStaleData = () => {
  const now = Date.now();
  
  // Cleanup live sessions
  for (const [vId, session] of liveVisitorsMap.entries()) {
    if (now - session.lastSeen > LIVE_SESSION_CUTOFF_MS) {
      liveVisitorsMap.delete(vId);
    }
  }

  // Cleanup rate limit store
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(key);
    }
  }

  // Cleanup deduplication store
  for (const [key, ts] of lastTrackedMap.entries()) {
    if (now - ts > 10 * 1000) {
      lastTrackedMap.delete(key);
    }
  }
};

// Periodic background cleanup every 2 minutes
setInterval(cleanupStaleData, 2 * 60 * 1000);

/**
 * Generate privacy-preserving one-way hash of client IP
 */
const hashIp = (rawIp) => {
  if (!rawIp) return 'unknown';
  const salt = 'cg_analytics_salt_2026';
  return crypto.createHash('sha256').update(rawIp + salt).digest('hex').substring(0, 16);
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

/**
 * @route   POST /api/analytics/track
 * @desc    Record page view event from public website
 * @access  Public
 */
export const trackPageView = async (req, res) => {
  try {
    cleanupStaleData();

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip || '127.0.0.1';
    const ipHash = hashIp(rawIp);

    const {
      visitorId,
      sessionId,
      path = '/',
      url = '',
      title = 'CodeGuru',
      referrer = 'Direct',
      device = 'desktop',
      browser = 'Other',
      os = 'Other',
      isHeartbeat = false
    } = req.body;

    if (!visitorId || typeof visitorId !== 'string') {
      return res.status(400).json({ success: false, message: 'visitorId is required' });
    }

    const cleanVisitorId = visitorId.trim().substring(0, 64);
    const cleanSessionId = (sessionId || cleanVisitorId).toString().trim().substring(0, 64);
    const cleanPath = (path || '/').split('?')[0].trim().substring(0, 200) || '/';
    const now = Date.now();

    // 1. Maintain in-memory live visitor session
    liveVisitorsMap.set(cleanVisitorId, {
      lastSeen: now,
      path: cleanPath,
      device: ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop',
      sessionId: cleanSessionId
    });

    // If request is purely a heartbeat keeping the session alive, update memory and return early
    if (isHeartbeat) {
      return res.json({ success: true, live: true });
    }

    // 2. Rate limiting protection against bots/spam
    const rateLimitKey = `${cleanVisitorId}_${ipHash}`;
    const rateRecord = rateLimitMap.get(rateLimitKey);
    if (rateRecord) {
      if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (rateRecord.count >= MAX_REQUESTS_PER_MINUTE) {
          // Exceeded limit: quietly acknowledge without writing to DB
          return res.json({ success: true, throttled: true });
        }
        rateRecord.count += 1;
      } else {
        rateLimitMap.set(rateLimitKey, { timestamp: now, count: 1 });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { timestamp: now, count: 1 });
    }

    // 3. Deduplication protection against React Strict Mode / rapid double rendering (within 3 seconds)
    const dedupKey = `${cleanVisitorId}_${cleanPath}`;
    const lastTrackedTime = lastTrackedMap.get(dedupKey);
    if (lastTrackedTime && (now - lastTrackedTime < 3000)) {
      return res.json({ success: true, deduplicated: true });
    }
    lastTrackedMap.set(dedupKey, now);

    // 4. Calculate date in Indian Standard Time (IST)
    const todayDate = getTodayKey();
    const referrerCategory = categorizeReferrer(referrer);
    const safeDevice = ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop';

    // Check if visitor has visited before (New vs Returning)
    const previousVisitCount = await PageView.countDocuments({ visitorId: cleanVisitorId });
    const isNewVisitor = previousVisitCount === 0;

    // 5. Save Granular PageView Event into MongoDB
    await PageView.create({
      visitorId: cleanVisitorId,
      sessionId: cleanSessionId,
      path: cleanPath,
      url: (url || cleanPath).substring(0, 300),
      title: (title || 'CodeGuru').substring(0, 150),
      referrer: (referrer || 'Direct').substring(0, 200),
      referrerCategory,
      device: safeDevice,
      browser: (browser || 'Other').substring(0, 50),
      os: (os || 'Other').substring(0, 50),
      ipHash,
      date: todayDate,
      isNewVisitor,
      timestamp: new Date()
    });

    // 6. Update DailyMetric summary record atomically
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

    return res.json({ success: true });
  } catch (err) {
    console.error('[analyticsController trackPageView Error]:', err.message);
    // Never fail public client navigation on analytics error
    return res.status(200).json({ success: false, error: err.message });
  }
};

/**
 * @route   GET /api/analytics/summary
 * @desc    Get top summary statistics for Admin Dashboard cards
 * @access  Admin Private
 */
export const getAnalyticsSummary = async (req, res) => {
  try {
    cleanupStaleData();

    const todayDate = getTodayKey();
    const yesterdayDate = getYesterdayKey();
    const monthStartDate = getMonthStartKey();

    // 1. Parallel execution for high speed
    const [
      todayUniqueVisitors,
      todayPageViews,
      yesterdayUniqueVisitors,
      yesterdayPageViews,
      monthUniqueVisitors,
      totalUniqueVisitors,
      totalPageViewsAllTime
    ] = await Promise.all([
      // Today's Unique Visitors
      PageView.distinct('visitorId', { date: todayDate }).then(arr => arr.length),
      // Today's Page Views
      PageView.countDocuments({ date: todayDate }),
      // Yesterday's Unique Visitors
      PageView.distinct('visitorId', { date: yesterdayDate }).then(arr => arr.length),
      // Yesterday's Page Views
      PageView.countDocuments({ date: yesterdayDate }),
      // This Month's Unique Visitors (from 1st of month to today)
      PageView.distinct('visitorId', { date: { $gte: monthStartDate, $lte: todayDate } }).then(arr => arr.length),
      // Total Unique Visitors across all time
      PageView.distinct('visitorId').then(arr => arr.length),
      // Total Page Views across all time
      PageView.countDocuments()
    ]);

    // Live active visitors (current active sessions in past 5 minutes)
    const liveVisitorsCount = liveVisitorsMap.size;

    // Calculate percentage changes
    let visitorGrowthPct = 0;
    if (yesterdayUniqueVisitors > 0) {
      visitorGrowthPct = Math.round(((todayUniqueVisitors - yesterdayUniqueVisitors) / yesterdayUniqueVisitors) * 100);
    } else if (todayUniqueVisitors > 0) {
      visitorGrowthPct = 100;
    }

    let viewsGrowthPct = 0;
    if (yesterdayPageViews > 0) {
      viewsGrowthPct = Math.round(((todayPageViews - yesterdayPageViews) / yesterdayPageViews) * 100);
    } else if (todayPageViews > 0) {
      viewsGrowthPct = 100;
    }

    return res.json({
      success: true,
      data: {
        todayVisitors: todayUniqueVisitors,
        todayPageViews: todayPageViews,
        yesterdayVisitors: yesterdayUniqueVisitors,
        yesterdayPageViews: yesterdayPageViews,
        thisMonthVisitors: monthUniqueVisitors,
        totalVisitors: totalUniqueVisitors,
        totalPageViews: totalPageViewsAllTime,
        liveVisitors: liveVisitorsCount,
        visitorGrowthPct,
        viewsGrowthPct,
        todayDate,
        yesterdayDate,
        monthStartDate
      }
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
  try {
    const { range = '7d', startDate, endDate, grouping = 'daily' } = req.query;
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
      // Default to 7 days
      dateKeys = getPastNDaysKeys(7);
    }

    if (dateKeys.length === 0) {
      dateKeys = getPastNDaysKeys(7);
    }

    // Aggregate page views and unique visitors by date
    const aggResults = await PageView.aggregate([
      { $match: { date: { $in: dateKeys } } },
      {
        $group: {
          _id: '$date',
          pageViews: { $sum: 1 },
          visitorsSet: { $addToSet: '$visitorId' }
        }
      }
    ]);

    // Build map of results
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
      const dateObj = new Date(dKey);
      const dayName = isNaN(dateObj.getTime()) ? dKey : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = isNaN(dateObj.getTime()) ? dKey : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        date: dKey,
        label: `${dayName}, ${formattedDate}`,
        shortLabel: formattedDate,
        dayOfWeek: dayName,
        pageViews: item.pageViews,
        uniqueVisitors: item.uniqueVisitors
      };
    });

    // Handle weekly or monthly grouping if requested
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
        label: new Date(`${mKey}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        shortLabel: new Date(`${mKey}-01`).toLocaleDateString('en-US', { month: 'short' }),
        pageViews: vals.pageViews,
        uniqueVisitors: vals.uniqueVisitors
      }));
    }

    // Calculate totals for the selected period
    const totalViewsInPeriod = dailyPoints.reduce((sum, p) => sum + p.pageViews, 0);
    const totalVisitorsInPeriod = dailyPoints.reduce((sum, p) => sum + p.uniqueVisitors, 0);

    return res.json({
      success: true,
      data: {
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
      }
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
  try {
    const { range = '7d', startDate, endDate, limit = 10 } = req.query;
    let matchFilter = {};

    if (range === 'today') {
      matchFilter.date = getTodayKey();
    } else if (range === 'yesterday') {
      matchFilter.date = getYesterdayKey();
    } else if (range === '30d') {
      const keys = getPastNDaysKeys(30);
      matchFilter.date = { $in: keys };
    } else if (range === 'custom' && startDate && endDate) {
      const keys = getDateRangeKeys(startDate, endDate);
      matchFilter.date = { $in: keys };
    } else if (range === 'all') {
      // all time
    } else {
      // default 7d
      const keys = getPastNDaysKeys(7);
      matchFilter.date = { $in: keys };
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
      
      // Generate clean friendly title
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

    return res.json({
      success: true,
      data: {
        totalViews: totalViewsInRange,
        pages: formattedPages
      }
    });
  } catch (err) {
    console.error('[analyticsController getTopPages Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @route   GET /api/analytics/realtime
 * @desc    Get live active visitors currently browsing the website
 * @access  Admin Private
 */
export const getRealtimeAnalytics = async (req, res) => {
  try {
    cleanupStaleData();

    const activeList = Array.from(liveVisitorsMap.values());
    const liveCount = activeList.length;

    // Group active visitors by current page
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
  try {
    const { range = '30d' } = req.query;
    const dateKeys = range === '7d' ? getPastNDaysKeys(7) : getPastNDaysKeys(30);

    const matchFilter = { date: { $in: dateKeys } };

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

    // 4. Traffic by Day of the Week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    const allVisits = await PageView.find(matchFilter, 'date').lean();
    allVisits.forEach(v => {
      if (v.date) {
        const dObj = new Date(v.date);
        if (!isNaN(dObj.getTime())) {
          const dName = daysOfWeek[dObj.getDay()];
          dayCounts[dName] = (dayCounts[dName] || 0) + 1;
        }
      }
    });

    return res.json({
      success: true,
      data: {
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
      }
    });
  } catch (err) {
    console.error('[analyticsController getVisitorInsights Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

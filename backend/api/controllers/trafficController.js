/**
 * ============================================================================
 * API CONTROLLER: TRAFFIC CONTROLLER (trafficController.js)
 * ============================================================================
 * Handles realtime visitor tracking, page views, search analytics, and stats via MongoDB Atlas.
 */

import { Traffic } from '../../models/Traffic.js';

// In-memory active user sessions tracker
const activeSessions = new Map();

/**
 * Clean stale live visitor sessions older than 5 minutes
 */
const cleanupSessions = () => {
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [ip, lastActive] of activeSessions.entries()) {
    if (lastActive < cutoff) {
      activeSessions.delete(ip);
    }
  }
};

/**
 * @route   GET /api/traffic/stats
 * @desc    Returns today visitors count, live active users, top searched courses, and city distribution.
 * @access  Admin Private
 */
export const getTrafficStats = async (req, res) => {
  cleanupSessions();
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    let todayRecord = await Traffic.findOne({ date: todayStr });

    if (!todayRecord) {
      todayRecord = await Traffic.create({
        date: todayStr,
        pageViews: 1,
        uniqueVisitors: 1,
        cities: [
          { name: 'Lucknow, UP', count: 1 }
        ],
        searchedCourses: []
      });
    }

    return res.json({
      success: true,
      data: {
        todayVisitors: todayRecord.uniqueVisitors || 1,
        todayPageViews: todayRecord.pageViews || 1,
        liveActive: activeSessions.size || 1,
        totalVisitors: todayRecord.uniqueVisitors || 1,
        cityBreakdown: todayRecord.cities || [],
        topSearchedCourses: todayRecord.searchedCourses || []
      }
    });
  } catch (e) {
    console.error('[trafficController Error]:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * @route   POST /api/traffic/visit
 * @desc    Logs a webpage visit from a user IP/session.
 * @access  Public
 */
export const recordVisit = async (req, res) => {
  const visitorIp = req.body.ip || req.ip || '127.0.0.1';
  activeSessions.set(visitorIp, Date.now());

  const todayStr = new Date().toISOString().split('T')[0];
  const userCity = req.body.city || 'Lucknow, UP';

  try {
    let todayRecord = await Traffic.findOne({ date: todayStr });
    if (!todayRecord) {
      todayRecord = new Traffic({ date: todayStr, pageViews: 1, uniqueVisitors: 1, cities: [{ name: userCity, count: 1 }] });
    } else {
      todayRecord.pageViews += 1;
      const cityItem = todayRecord.cities.find(c => c.name === userCity);
      if (cityItem) {
        cityItem.count += 1;
      } else {
        todayRecord.cities.push({ name: userCity, count: 1 });
      }
    }
    await todayRecord.save();
  } catch (e) {
    console.warn('[trafficController Warning] Error logging visit:', e.message);
  }

  res.json({ success: true });
};

/**
 * @route   POST /api/traffic/search-course
 * @desc    Tracks searched course query keywords for demand analytics.
 * @access  Public
 */
export const trackCourseSearch = async (req, res) => {
  const query = (req.body.query || '').trim();
  if (!query) return res.json({ success: false });

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    let todayRecord = await Traffic.findOne({ date: todayStr });
    if (todayRecord) {
      const searchItem = todayRecord.searchedCourses.find(s => s.query.toLowerCase() === query.toLowerCase());
      if (searchItem) {
        searchItem.count += 1;
      } else {
        todayRecord.searchedCourses.push({ query, count: 1 });
      }
      await todayRecord.save();
    }
  } catch (e) {}

  res.json({ success: true });
};

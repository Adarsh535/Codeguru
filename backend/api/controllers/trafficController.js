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
          { name: 'Ayodhya, UP', count: 1 }
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
 * @desc    Logs a webpage visit from a user IP/session atomically.
 * @access  Public
 */
export const recordVisit = async (req, res) => {
  const visitorIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  activeSessions.set(visitorIp, Date.now());

  const todayStr = new Date().toISOString().split('T')[0];
  const userCity = String(req.body?.city || 'Ayodhya, UP').slice(0, 50);

  try {
    // Atomic update if city already exists in today's record
    const updated = await Traffic.findOneAndUpdate(
      { date: todayStr, 'cities.name': userCity },
      { 
        $inc: { pageViews: 1, 'cities.$.count': 1 }
      },
      { new: true }
    );

    // If city wasn't in array or record didn't exist yet
    if (!updated) {
      await Traffic.findOneAndUpdate(
        { date: todayStr },
        {
          $inc: { pageViews: 1, uniqueVisitors: 1 },
          $push: { 
            cities: { 
              $each: [{ name: userCity, count: 1 }],
              $slice: -50 // Keep max 50 top cities
            } 
          }
        },
        { upsert: true, new: true }
      );
    }
  } catch (e) {
    console.warn('[trafficController Warning] Error logging visit:', e.message);
  }

  res.json({ success: true });
};

/**
 * @route   POST /api/traffic/search-course
 * @desc    Tracks searched course query keywords atomically.
 * @access  Public
 */
export const trackCourseSearch = async (req, res) => {
  const query = String(req.body?.query || '').trim().slice(0, 80);
  if (!query) return res.json({ success: false });

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const updated = await Traffic.findOneAndUpdate(
      { date: todayStr, 'searchedCourses.query': query },
      { $inc: { 'searchedCourses.$.count': 1 } },
      { new: true }
    );

    if (!updated) {
      await Traffic.findOneAndUpdate(
        { date: todayStr },
        { 
          $push: { 
            searchedCourses: { 
              $each: [{ query, count: 1 }],
              $slice: -50 // Bounded array size
            } 
          } 
        },
        { upsert: true, new: true }
      );
    }
  } catch (e) {
    console.warn('[trafficController Warning] Error tracking search:', e.message);
  }

  res.json({ success: true });
};

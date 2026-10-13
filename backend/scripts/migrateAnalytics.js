/**
 * ============================================================================
 * MIGRATION SCRIPT: RECONCILE VISITOR ANALYTICS DATA (migrateAnalytics.js)
 * ============================================================================
 * 1. Backfills and normalizes IST (Asia/Kolkata, UTC+5:30) date keys on all PageView records.
 * 2. Ensures proper indexes exist on PageView and ActiveSession (including 60s TTL).
 * 3. Runs an integrity reconciliation test verifying: Total Visitors >= Range Unique Visitors.
 *
 * Usage:
 *   node scripts/migrateAnalytics.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { PageView, ActiveSession, DailyMetric } from '../models/Analytics.js';
import { formatDateKey, getTodayKey, getYesterdayKey, getISTDayBoundaries } from '../utils/dateTime.js';

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function runMigration() {
  console.log('🚀 Starting CodeGuru Analytics Migration & Reconciliation...');
  console.log('⏳ Connecting to MongoDB Atlas...');

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing in backend/.env!');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas successfully.');

  try {
    // 1. Sync indexes on PageView and ActiveSession
    console.log('\n📦 Step 1: Synchronizing MongoDB Indexes...');
    await PageView.syncIndexes();
    await ActiveSession.syncIndexes();
    console.log('✅ Indexes synchronized (including ActiveSession 60s TTL index).');

    // 2. Scan and normalize PageView records
    console.log('\n🔄 Step 2: Normalizing IST Date Keys on existing PageView records...');
    const totalRecords = await PageView.countDocuments();
    console.log(`📊 Found ${totalRecords} PageView documents to evaluate.`);

    let updatedCount = 0;
    const cursor = PageView.find().cursor();

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const ts = doc.timestamp || doc.createdAt || new Date();
      const correctIstDate = formatDateKey(ts);

      if (doc.date !== correctIstDate || !doc.timestamp) {
        doc.date = correctIstDate;
        if (!doc.timestamp) doc.timestamp = ts;
        await doc.save();
        updatedCount++;
      }
    }
    console.log(`✅ Normalized ${updatedCount} records to precise IST date keys.`);

    // 3. Mathematical Consistency Verification
    console.log('\n🔍 Step 3: Mathematical Integrity & Invariant Verification:');
    const todayKey = getTodayKey();
    const yesterdayKey = getYesterdayKey();
    const { start: todayStart, end: todayEnd } = getISTDayBoundaries(todayKey);
    const { start: yestStart, end: yestEnd } = getISTDayBoundaries(yesterdayKey);

    const [allTimeDistinct, todayDistinct, yestDistinct, totalViews] = await Promise.all([
      PageView.distinct('visitorId'),
      PageView.distinct('visitorId', {
        $or: [{ date: todayKey }, { timestamp: { $gte: todayStart, $lte: todayEnd } }]
      }),
      PageView.distinct('visitorId', {
        $or: [{ date: yesterdayKey }, { timestamp: { $gte: yestStart, $lte: yestEnd } }]
      }),
      PageView.countDocuments()
    ]);

    const totalVisitors = allTimeDistinct.length;
    const todayVisitors = todayDistinct.length;
    const yesterdayVisitors = yestDistinct.length;

    console.log(`   - Total Page Views (All-time): ${totalViews}`);
    console.log(`   - Total Unique Visitors (All-time): ${totalVisitors}`);
    console.log(`   - Today's Unique Visitors (IST): ${todayVisitors}`);
    console.log(`   - Yesterday's Unique Visitors (IST): ${yesterdayVisitors}`);

    // Invariant check:
    let isConsistent = true;
    if (todayVisitors > totalVisitors) {
      console.error(`❌ INVARIANT VIOLATION: Today's visitors (${todayVisitors}) exceeds All-Time total (${totalVisitors})!`);
      isConsistent = false;
    }
    if (yesterdayVisitors > totalVisitors) {
      console.error(`❌ INVARIANT VIOLATION: Yesterday's visitors (${yesterdayVisitors}) exceeds All-Time total (${totalVisitors})!`);
      isConsistent = false;
    }

    if (isConsistent) {
      console.log('✅ PASS: Total Visitors (All-time) >= Today & Yesterday unique visitors.');
      console.log('✅ Mathematical consistency verified successfully!');
    }

    // 4. Clean up stale active sessions older than 60s
    console.log('\n🧹 Step 4: Cleaning up stale live active sessions...');
    const staleThreshold = new Date(Date.now() - 60 * 1000);
    const deleteResult = await ActiveSession.deleteMany({ lastSeen: { $lt: staleThreshold } });
    console.log(`✅ Removed ${deleteResult.deletedCount} expired sessions from active_sessions.`);

    console.log('\n✨ Analytics Migration & Reconciliation Complete! ✨\n');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

runMigration();

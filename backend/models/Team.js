/**
 * ============================================================================
 * MONGOOSE MODEL: CODEGURU TEAM MEMBER (Team.js)
 * ============================================================================
 * Mongoose Schema defining staff instructors & tech mentors in MongoDB.
 */

import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  photo: { type: String, default: '' },
  experience: { type: String, default: '8+ Yrs Exp' },
  bio: { type: String, default: '' },
  specialization: { type: String, default: 'Full Stack & System Design' }
}, {
  timestamps: true
});

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

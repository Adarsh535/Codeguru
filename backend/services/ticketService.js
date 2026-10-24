import crypto from 'crypto';

// Server-side in-memory ticket store with 60s expiration
// ticket -> { adminId, role, expiresAt }
const tickets = new Map();

// Periodic cleanup of expired tickets
setInterval(() => {
  const now = Date.now();
  for (const [ticket, data] of tickets.entries()) {
    if (now > data.expiresAt) {
      tickets.delete(ticket);
    }
  }
}, 30000);

export const issueRealtimeTicket = (admin) => {
  const ticket = crypto.randomBytes(24).toString('hex');
  tickets.set(ticket, {
    sub: admin.sub || admin.id || admin._id,
    role: admin.role,
    expiresAt: Date.now() + 60 * 1000 // 60 seconds
  });
  return ticket;
};

export const consumeRealtimeTicket = (ticket) => {
  if (!ticket || typeof ticket !== 'string') return null;
  const data = tickets.get(ticket);
  if (!data) return null;
  // One-time ticket: consume immediately
  tickets.delete(ticket);
  if (Date.now() > data.expiresAt) return null;
  return data;
};

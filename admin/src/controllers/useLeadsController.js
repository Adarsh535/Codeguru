/**
 * ============================================================================
 * CONTROLLER LAYER: LEADS MANAGEMENT CONTROLLER (useLeadsController.js)
 * ============================================================================
 * Custom hook containing business logic, event listeners, state orchestration,
 * and data flow between UI Views and leadModel.
 */

import { useState, useEffect, useCallback } from 'react';
import { leadModel } from '../models/leadModel';

export function useLeadsController(isAuthenticated = true) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    todayCount: 0,
    newCount: 0,
    enrolledCount: 0,
    conversionRate: 0,
    courseCounts: {}
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalLead, setDeleteModalLead] = useState(null);

  // Fetch leads data and compute statistical metrics
  const loadData = useCallback(async () => {
    const fetchedLeads = await leadModel.getLeads();
    const fetchedStats = leadModel.getStats(fetchedLeads);
    setLeads(fetchedLeads);
    setStats(fetchedStats);
  }, []);

  // Sync background polling and cross-tab storage events
  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      const handleSync = () => {
        loadData();
      };

      const interval = setInterval(() => {
        loadData();
      }, 1500);

      window.addEventListener('storage', handleSync);
      window.addEventListener('codeguru_lead_added', handleSync);
      window.addEventListener('codeguru_refresh_all', handleSync);
      window.addEventListener('focus', handleSync);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleSync);
        window.removeEventListener('codeguru_lead_added', handleSync);
        window.removeEventListener('codeguru_refresh_all', handleSync);
        window.removeEventListener('focus', handleSync);
      };
    }
  }, [isAuthenticated, loadData]);

  // Action Controller: Update lead status
  const handleUpdateStatus = async (id, newStatus) => {
    await leadModel.updateStatus(id, newStatus);
    await loadData();
  };

  // Action Controller: Open Delete Modal
  const handleDeleteLead = (id, leadObj) => {
    const target = leadObj || leads.find(l => l.id === id) || { id };
    setDeleteModalLead(target);
  };

  // Action Controller: Confirm & execute lead deletion
  const confirmDeleteLead = async () => {
    if (!deleteModalLead) return;
    await leadModel.deleteLead(deleteModalLead.id);
    setDeleteModalLead(null);
    await loadData();
  };

  // Action Controller: Add new lead inquiry
  const handleAddLead = async (leadData) => {
    await leadModel.addLead(leadData);
    await loadData();
  };

  return {
    leads,
    stats,
    searchQuery,
    setSearchQuery,
    deleteModalLead,
    setDeleteModalLead,
    loadData,
    handleUpdateStatus,
    handleDeleteLead,
    confirmDeleteLead,
    handleAddLead
  };
}

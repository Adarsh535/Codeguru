'use client';

/**
 * ============================================================================
 * FRONTEND MVC: TEAM CONTROLLER (useTeamController.js)
 * ============================================================================
 * Manages instructors, mentors, and team members state.
 */

import { useState, useEffect, useCallback } from 'react';
import { teamModel } from '../models/teamModel';

export function useTeamController() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teamModel.getTeam();
      if (Array.isArray(data) && data.length > 0) {
        setTeam(data);
      }
    } catch (err) {
      console.warn('[useTeamController] Error loading team:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return {
    team,
    loading,
    refreshTeam: fetchTeam
  };
}

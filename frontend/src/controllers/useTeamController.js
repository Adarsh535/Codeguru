/**
 * ============================================================================
 * CONTROLLER LAYER: TEAM CONTROLLER (useTeamController.js)
 * ============================================================================
 * Custom hook handling team instructors fetching and slider navigation.
 */

import { useState, useEffect, useCallback } from 'react';
import { teamModel } from '../models/teamModel';

export function useTeamController() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    const data = await teamModel.getTeam();
    setTeamMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  return {
    teamMembers,
    loading,
    refreshTeam: loadTeam
  };
}

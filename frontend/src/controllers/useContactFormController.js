/**
 * CONTROLLER: Contact Form Controller Hook
 * Manages Get in Touch form input states, captcha, and inquiry submission logic
 * with accurate fresh GPS location detection, fallback to manual city selection,
 * and zero silent hardcoded city bugs.
 */
import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { API_BASE } from '../models/apiClient';
import { getFreshStudentLocation, getApproximateIpLocation } from '../utils/geoLocator';

export function useContactFormController() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Full Stack Web Development'
  });

  // Location-specific states
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting' | 'detected' | 'manual' | 'ip_approx'
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [locationData, setLocationData] = useState({
    city: '',
    state: '',
    stateCode: '',
    latitude: null,
    longitude: null,
    location_source: 'unknown',
    isApproximate: false
  });
  const [manualCity, setManualCity] = useState('');
  const [ipSuggestion, setIpSuggestion] = useState(null);

  // Promise ref to allow handleSubmit to wait if user submits while detection is running
  const activeDetectionPromiseRef = useRef(null);

  const [adminPhone, setAdminPhone] = useState('9670912923');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertModalConfig, setAlertModalConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    buttonText: 'Done'
  });

  const closeAlertModal = () => {
    setAlertModalConfig(prev => ({ ...prev, isOpen: false }));
    setIsSubmitted(false);
  };

  const showAlertModal = (type, title, message, buttonText = 'Done') => {
    setAlertModalConfig({
      isOpen: true,
      type,
      title,
      message,
      buttonText
    });
  };

  // Fetch dynamic Admin notification phone number from MongoDB Settings API
  useEffect(() => {
    try {
      const storedPhone = localStorage.getItem('codeguru_admin_phone');
      if (storedPhone) setAdminPhone(storedPhone);
    } catch (e) {}

    fetch(`${API_BASE}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.adminPhone) {
          setAdminPhone(data.data.adminPhone);
          try {
            localStorage.setItem('codeguru_admin_phone', data.data.adminPhone);
          } catch (e) {}
        }
      })
      .catch(err => console.warn('[useContactFormController] Using cached notification phone number:', err));
  }, []);

  /**
   * Primary location detector: runs fresh without stale cache
   */
  const startLocationDetection = () => {
    setIsDetectingLocation(true);
    setLocationStatus('detecting');

    const detectionPromise = (async () => {
      try {
        console.log('[CodeGurru Inquiry] Requesting fresh GPS location...');
        const gpsRes = await getFreshStudentLocation();

        if (gpsRes.success && gpsRes.city) {
          console.log('[CodeGurru Inquiry] GPS Geolocation success:', gpsRes);
          const detected = {
            city: gpsRes.city,
            state: gpsRes.state || '',
            stateCode: gpsRes.stateCode || '',
            latitude: gpsRes.latitude,
            longitude: gpsRes.longitude,
            location_source: 'gps',
            isApproximate: false
          };
          setLocationData(detected);
          setLocationStatus('detected');
          setIsDetectingLocation(false);
          return detected;
        }

        console.warn('[CodeGurru Inquiry] GPS detection failed or was denied:', gpsRes.error);
        // If GPS is denied or fails, trigger manual mode
        setLocationStatus('manual');
        setIsDetectingLocation(false);

        // Fetch IP in background as an approximate hint/suggestion for the user
        getApproximateIpLocation().then(ipRes => {
          if (ipRes && ipRes.success && ipRes.city) {
            setIpSuggestion(ipRes);
          }
        }).catch(() => {});

        return null;
      } catch (err) {
        console.error('[useContactFormController] Geolocation error:', err);
        setLocationStatus('manual');
        setIsDetectingLocation(false);
        return null;
      }
    })();

    activeDetectionPromiseRef.current = detectionPromise;
    return detectionPromise;
  };

  // Trigger fresh location detection on mount
  useEffect(() => {
    startLocationDetection();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Security: Strip all non-digits, limit strictly to 10 digits
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleManualCityChange = (e) => {
    const val = typeof e === 'string' ? e : e.target.value;
    setManualCity(val);
    if (val.trim()) {
      setLocationData({
        city: val.trim(),
        state: '',
        stateCode: '',
        latitude: null,
        longitude: null,
        location_source: 'manual',
        isApproximate: false
      });
    }
  };

  const acceptIpSuggestion = () => {
    if (!ipSuggestion || !ipSuggestion.city) return;
    setManualCity(ipSuggestion.city);
    setLocationData({
      city: ipSuggestion.city,
      state: ipSuggestion.state || '',
      stateCode: ipSuggestion.stateCode || '',
      latitude: ipSuggestion.latitude || null,
      longitude: ipSuggestion.longitude || null,
      location_source: 'ip',
      isApproximate: true
    });
    setLocationStatus('ip_approx');
  };

  const toggleCaptcha = () => {
    setIsCaptchaChecked(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = (formData.name || '').trim();
    const cleanPhone = (formData.phone || '').trim().replace(/\D/g, '');

    // Validation
    if (!cleanName || cleanName.length < 2) {
      showAlertModal('error', 'Name Required', 'Please enter your full name (minimum 2 characters).', 'Done');
      return;
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      showAlertModal('error', 'Valid Phone Required', 'Please enter a valid 10-digit mobile number.', 'Done');
      return;
    }
    // Block dummy repeating digits (e.g., 0000000000, 1111111111)
    if (/^(\d)\1{9}$/.test(cleanPhone)) {
      showAlertModal('error', 'Invalid Phone', 'Repeated dummy numbers are not allowed. Please enter your real mobile number.', 'Done');
      return;
    }
    // Indian mobile numbers must start with 6, 7, 8, or 9
    if (!/^[6-9]/.test(cleanPhone)) {
      showAlertModal('error', 'Invalid Phone', 'Mobile numbers must start with 6, 7, 8, or 9.', 'Done');
      return;
    }

    // 1. If location is currently detecting, wait for it to complete
    let currentLocData = locationData;
    if (isDetectingLocation && activeDetectionPromiseRef.current) {
      try {
        console.log('[CodeGurru Inquiry] Form submitted while detecting location. Waiting for GPS resolution...');
        const result = await activeDetectionPromiseRef.current;
        if (result && result.city) {
          currentLocData = result;
        }
      } catch (e) {}
    }

    // 2. Determine final city and state
    const resolvedCity = (currentLocData.city || manualCity).trim();
    const resolvedState = currentLocData.state || '';
    const resolvedSource = currentLocData.location_source !== 'unknown'
      ? currentLocData.location_source
      : (resolvedCity ? 'manual' : 'unknown');

    // City is required
    if (!resolvedCity) {
      setLocationStatus('manual');
      showAlertModal('error', 'City Required', 'Please enter your current city to submit your inquiry.', 'Enter City');
      return;
    }

    const displayLocation = resolvedState
      ? `${resolvedCity}, ${resolvedState}`
      : resolvedCity;

    const newLead = {
      name: cleanName,
      phone: cleanPhone,
      email: formData.email ? formData.email.trim() : '',
      location: displayLocation,
      city: resolvedCity,
      state: resolvedState,
      latitude: currentLocData.latitude || null,
      longitude: currentLocData.longitude || null,
      location_source: resolvedSource,
      course: formData.course || 'Full Stack Web Development',
      status: 'New',
      notes: `Inquiry from Portal (City: ${resolvedCity}, Source: ${resolvedSource}${currentLocData.isApproximate ? ' - approximate' : ''})`
    };

    console.log('[CodeGurru Inquiry] Submitting lead payload to Backend API:', newLead);

    setIsSubmitting(true);
    try {
      // 1. Await Backend Express Server API submission
      const result = await apiService.submitLead(newLead);

      if (result && (result.success || result.data)) {
        setIsSubmitted(true);

        // 2. Save submitted lead to shared localStorage for Admin Dashboard
        try {
          const createdLead = result.data || newLead;
          const existingRaw = localStorage.getItem('codeguru_leads');
          const existingLeads = existingRaw ? JSON.parse(existingRaw) : [];
          const updatedLeads = [createdLead, ...existingLeads];
          localStorage.setItem('codeguru_leads', JSON.stringify(updatedLeads));
          localStorage.setItem('codeguru_inquiry_submitted', 'true');

          // Fire cross-tab and local events
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: createdLead }));
          window.dispatchEvent(new CustomEvent('codeguru_refresh_leads'));
        } catch (storageErr) {
          console.warn('[useContactFormController] Storage sync warning:', storageErr);
        }

        // 3. Trigger SweetAlert popup modal
        showAlertModal(
          'success',
          'Thank You!',
          'Your query has been submitted successfully. Our admission team will contact you shortly.',
          'Done'
        );

        // Reset form fields
        setFormData(prev => ({ name: '', phone: '', email: '', course: prev.course || 'Full Stack Web Development' }));
        setIsCaptchaChecked(false);
      } else {
        showAlertModal(
          'error',
          'Submission Failed',
          result?.message || 'Could not submit your inquiry. Please check your details and try again.',
          'Retry'
        );
      }
    } catch (err) {
      console.error('[useContactFormController] Lead submission network error:', err);
      showAlertModal(
        'error',
        'Connection Failed',
        'Could not reach server. Please check your internet connection.',
        'Retry'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    locationStatus,
    isDetectingLocation,
    locationData,
    manualCity,
    ipSuggestion,
    setManualCity: handleManualCityChange,
    acceptIpSuggestion,
    retryLocationDetection: startLocationDetection,
    isCaptchaChecked,
    isSubmitting,
    isSubmitted,
    alertModalConfig,
    closeAlertModal,
    showAlertModal,
    handleChange,
    handleSubmit,
    toggleCaptcha
  };
}

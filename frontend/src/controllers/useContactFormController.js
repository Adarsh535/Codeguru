/**
 * CONTROLLER: Contact Form Controller Hook
 * Manages Get in Touch form input states, captcha, and query submission logic with automatic silent background location tracking.
 */
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_BASE } from '../models/apiClient';
import { sanitizeLocation, sanitizeCityName } from '../utils/locationSanitizer';

export function useContactFormController() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Lucknow, UP',
    course: 'Full Stack Web Development'
  });
  const [adminPhone, setAdminPhone] = useState('9670912923');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
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

  // Auto-detect student location silently in the background
  useEffect(() => {
    let isMounted = true;

    const detectLocation = async () => {
      // 1. Check if user selected/saved a location previously
      try {
        const savedLoc = localStorage.getItem('codeguru_selected_location');
        if (savedLoc) {
          const parsed = JSON.parse(savedLoc);
          if (parsed?.name && isMounted) {
            const sanitized = sanitizeLocation(parsed);
            setFormData(prev => ({ ...prev, location: sanitized.name }));
            return;
          }
        }
      } catch (e) {}

      // 2. Try browser HTML5 Geolocation reverse geocoding
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              if (data && data.address && isMounted) {
                const rawCity = data.address.city || data.address.town || data.address.state_district || data.address.county || data.address.state || 'Lucknow';
                const city = sanitizeCityName(rawCity, data.address.state);
                const locStr = `${city}, UP`;
                setFormData(prev => ({ ...prev, location: locStr }));
                return;
              }
            } catch (err) {
              console.warn('Geolocation reverse geocode failed:', err);
            }
          },
          (err) => {
            console.warn('Geolocation access declined/unavailable:', err.message);
          },
          { timeout: 5000, maximumAge: 300000 }
        );
      }

      // 3. Try IP Geolocation API fallback
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.city && isMounted) {
            const city = sanitizeCityName(ipData.city, ipData.region);
            const state = ipData.region_code || ipData.region || 'UP';
            const locStr = `${city}, ${state}`;
            setFormData(prev => ({ ...prev, location: locStr }));
            return;
          }
        }
      } catch (err) {
        console.warn('IP Geolocation fallback failed:', err);
      }

      // 4. Default fallback: Lucknow, UP
      if (isMounted) {
        setFormData(prev => ({ ...prev, location: prev.location || 'Lucknow, UP' }));
      }
    };

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCaptcha = () => {
    setIsCaptchaChecked(prev => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = formData.name ? formData.name.trim() : '';
    const cleanPhone = formData.phone ? formData.phone.trim() : '';
    const cleanLocation = formData.location ? formData.location.trim() : 'Lucknow, UP';

    if (!cleanName) {
      showAlertModal('error', 'Ooops', 'Please enter your full name to proceed.', 'Done');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      showAlertModal('error', 'Ooops', 'Please enter a valid 10-digit mobile number.', 'Done');
      return;
    }

    setIsSubmitted(true);

    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      phone: cleanPhone,
      location: cleanLocation,
      course: formData.course || 'Full Stack Web Development',
      status: 'New',
      createdAt: new Date().toISOString(),
      notes: `Submitted via Inquiry Form (Auto Location: ${cleanLocation})`
    };

    // 1. Submit to Backend Express Server API
    apiService.submitLead(newLead);

    // 2. Save submitted lead to shared localStorage for Admin Dashboard
    try {
      const existingRaw = localStorage.getItem('codeguru_leads');
      const existingLeads = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedLeads = [newLead, ...existingLeads];
      localStorage.setItem('codeguru_leads', JSON.stringify(updatedLeads));

      // Mark inquiry as submitted so popup doesn't appear automatically again
      localStorage.setItem('codeguru_inquiry_submitted', 'true');

      // Fire cross-tab and local events
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('codeguru_lead_added', { detail: newLead }));
    } catch (err) {
      console.error('Error saving lead to Admin store:', err);
    }

    // 3. Background notification handled silently via REST API to Admin Phone (9670912923)
    // (No WhatsApp popup/redirect tab launched)

    // 4. Trigger SweetAlert style popup modal
    showAlertModal(
      'success',
      'Thank You!',
      'Your query has been submitted successfully. Our expert team will contact you shortly.',
      'Done'
    );

    // Reset form fields
    setFormData(prev => ({ name: '', phone: '', location: prev.location || 'Lucknow, UP', course: 'Full Stack Web Development' }));
    setIsCaptchaChecked(false);
  };

  return {
    formData,
    isCaptchaChecked,
    isSubmitted,
    alertModalConfig,
    closeAlertModal,
    showAlertModal,
    handleChange,
    handleSubmit,
    toggleCaptcha
  };
}


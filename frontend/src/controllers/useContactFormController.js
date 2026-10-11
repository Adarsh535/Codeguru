/**
 * CONTROLLER: Contact Form Controller Hook
 * Manages Get in Touch form input states, captcha, and query submission logic with automatic silent background location tracking.
 */
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { API_BASE } from '../models/apiClient';
import { detectStudentRealLocation, getQuickLocationSync } from '../utils/geoLocator';

export function useContactFormController() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: getQuickLocationSync() || '',
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

  // Detect the student's actual current location in the background
  useEffect(() => {
    let isMounted = true;

    // Detect actual live location of student
    detectStudentRealLocation().then((loc) => {
      if (isMounted && loc?.name) {
        setFormData(prev => ({
          ...prev,
          location: loc.name
        }));
      }
    });

    const handleLocationUpdate = (e) => {
      if (isMounted && e.detail?.name) {
        setFormData(prev => ({
          ...prev,
          location: e.detail.name
        }));
      }
    };

    window.addEventListener('codeguru_location_updated', handleLocationUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('codeguru_location_updated', handleLocationUpdate);
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCaptcha = () => {
    setIsCaptchaChecked(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = formData.name ? formData.name.trim() : '';
    const cleanPhone = formData.phone ? formData.phone.trim() : '';

    if (!cleanName) {
      showAlertModal('error', 'Ooops', 'Please enter your full name to proceed.', 'Done');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      showAlertModal('error', 'Ooops', 'Please enter a valid 10-digit mobile number.', 'Done');
      return;
    }

    // Capture the real, exact live physical location of the student filling the form
    let cleanLocation = formData.location ? formData.location.trim() : '';
    if (!cleanLocation || cleanLocation === 'Ayodhya, UP') {
      try {
        const liveLoc = await detectStudentRealLocation();
        if (liveLoc?.name) {
          cleanLocation = liveLoc.name;
        }
      } catch (err) {}
    }
    if (!cleanLocation) {
      cleanLocation = getQuickLocationSync() || 'Ayodhya, UP';
    }

    setIsSubmitted(true);

    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      phone: cleanPhone,
      email: formData.email ? formData.email.trim() : '',
      location: cleanLocation,
      course: formData.course || 'Full Stack Web Development',
      status: 'New',
      createdAt: new Date().toISOString(),
      notes: `Submitted via Inquiry Form (Live Location: ${cleanLocation})`
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

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);

    // Reset form fields
    setFormData(prev => ({ name: '', phone: '', location: prev.location || 'Ayodhya, UP', course: 'Full Stack Web Development' }));
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


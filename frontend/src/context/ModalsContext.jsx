'use client';

import React, { createContext, useContext } from 'react';

const ModalsContext = createContext({
  openEnrollModal: () => {},
  openContactModal: () => {},
  openInquiryModal: () => {},
  openOtpSheet: () => {},
  openLocationModal: () => {},
  openPlacementModal: () => {},
  user: null,
  selectedLocation: null,
  selectedCategory: null
});

export const ModalsProvider = ModalsContext.Provider;

export const useModals = () => {
  const context = useContext(ModalsContext);
  return context;
};

export default ModalsContext;

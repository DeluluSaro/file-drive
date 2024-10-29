"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Create a Context for the IP Address
const IpAddressContext = createContext<string | undefined>(undefined);

// Provider component
export const IpAddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('192.168.0.10'); // Default IP Address

  return (
    <IpAddressContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IpAddressContext.Provider>
  );
};

// Custom hook to use the IpAddressContext
export const useIpAddress = () => {
  const context = useContext(IpAddressContext);
  if (!context) {
    throw new Error('useIpAddress must be used within an IpAddressProvider');
  }
  return context;
};

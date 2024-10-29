"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define a type for the context value
interface IpAddressContextType {
  ipAddress: string;
  setIpAddress: Dispatch<SetStateAction<string>>;
}

// Create a Context with a default value of undefined
const IpAddressContext = createContext<IpAddressContextType | undefined>(undefined);

// Provider component
export const IpAddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ipAddress, setIpAddress] = useState<string>('192.168.0.10'); // Default IP Address

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

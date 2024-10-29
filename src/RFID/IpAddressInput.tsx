// components/IpAddressInput.tsx
"use client";
import React, { useState } from 'react';
import { useIpAddress } from '@/context/IpAddressContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function IpAddressInput() {
  const { setIpAddress } = useIpAddress();
  const [inputValue, setInputValue] = useState("");

  const handleUpdateIp = () => {
    
    setIpAddress(inputValue);
    setInputValue(""); // Clear input after updating
    
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter ESP8266 IP address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleUpdateIp}>Update IP Address</Button>
    </div>
  );
}

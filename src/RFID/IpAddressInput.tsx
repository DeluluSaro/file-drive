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
    if (inputValue.trim() === "") {
      // Optionally, you can show an error message here if you have a toast or alert system
      return;
    }

    setIpAddress(inputValue.trim());
    setInputValue(""); // Clear input after updating
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="text"
        placeholder="Enter ESP8266 IP address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full" // Optionally add styling for better layout control
      />
      <Button onClick={handleUpdateIp} disabled={!inputValue.trim()}>
        Update IP Address
      </Button>
    </div>
  );
}

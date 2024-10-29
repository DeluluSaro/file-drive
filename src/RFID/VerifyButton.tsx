"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { useIpAddress } from '@/context/IpAddressContext';

export default function VerifyCardButton() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { ipAddress } = useIpAddress(); // Get IP Address from Context
  const [loading, setLoading] = useState(false);

  const verifyCard = async () => {
    setLoading(true);

    try {
      const phoneNumber = user?.primaryPhoneNumber?.phoneNumber || '';
      
      if (!phoneNumber) {
        toast({
          title: "Error",
          description: "Phone number not found.",
          variant: "destructive",
        });
        return;
      }

      if (!ipAddress) {
        toast({
          title: "Error",
          description: "IP address not set. Please enter a valid IP address.",
          variant: "destructive",
        });
        return;
      }

      // Set the phone number in the ESP8266 before verification
      const phoneResponse = await fetch(`http://${ipAddress}/setPhoneNumber?phone=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
      });

      if (!phoneResponse.ok) {
        toast({
          title: "Error",
          description: "Failed to set phone number on the device.",
          variant: "destructive",
        });
        return;
      }

      // Verify the card
      const response = await fetch(`http://${ipAddress}/verifyCard`, { method: 'GET' });

      if (response.ok) {
        toast({
          title: "Verified",
          description: "Card found! Redirecting to dashboard...",
        });
        router.push('/dashboard/files');
      } else if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "Card not found in database.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Error",
          description: "Error verifying card. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the device. Check the IP address and connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={verifyCard} disabled={loading}>
      {loading ? "Verifying..." : "Verify Card"}
    </Button>
  );
}

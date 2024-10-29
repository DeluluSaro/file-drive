// components/VerifyCardButton.tsx
"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';

export default function VerifyCardButton() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
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
        setLoading(false);
        return;
      }

      // Set the phone number in the ESP8266 before verification
      await fetch(`http://192.168.0.100/setPhoneNumber?phone=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
      });

      const response = await fetch('http://192.168.0.100/verifyCard', { method: 'GET' });

      if (response.status === 200) {
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
        description: "Unable to connect to the device.",
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

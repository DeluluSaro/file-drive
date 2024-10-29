"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { useIpAddress } from '@/context/IpAddressContext';
// import { useIpAddress } from '@/components/context/IpAddressContext';

export default function AddCardButton() {
  const { toast } = useToast();
  const { user } = useUser();
  const { ipAddress } = useIpAddress(); // Get IP Address from Context

  const addCard = async () => {
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

      // Set the phone number in the ESP8266 before adding the card
      await fetch(`http://${ipAddress}/setPhoneNumber?phone=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
      });

      // Call the addCard endpoint
      const response = await fetch(`http://${ipAddress}/addCard`);

      if (response.ok) {
        const message = await response.text();
        toast({
          title: "Success",
          description: message,
        });
      } else {
        toast({
          title: "Oops",
          description: "Failed to save card: " + response.statusText,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to reach the reader. Check connections and IP address.",
        variant: "destructive",
      });
    }
  };

  return <Button variant="outline" onClick={addCard}>Add RFID Card to Database</Button>;
}

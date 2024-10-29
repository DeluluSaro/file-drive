"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { useIpAddress } from '@/context/IpAddressContext';

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

      if (!ipAddress) {
        toast({
          title: "Error",
          description: "IP address not set. Please enter a valid IP address.",
          variant: "destructive",
        });
        return;
      }

      // Set the phone number in the ESP8266 before adding the card
      const phoneResponse = await fetch(`http://${ipAddress}/setPhoneNumber?phone=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
      });

      if (!phoneResponse.ok) {
        throw new Error(`Failed to set phone number: ${phoneResponse.statusText}`);
      }

      // Call the addCard endpoint
      const addCardResponse = await fetch(`http://${ipAddress}/addCard`);

      if (addCardResponse.ok) {
        const message = await addCardResponse.text();
        toast({
          title: "Success",
          description: message,
        });
      } else {
        throw new Error(`Failed to add card: ${addCardResponse.statusText}`);
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: `Unable to reach the reader: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return <Button variant="outline" onClick={addCard}>Add RFID Card to Database</Button>;
}

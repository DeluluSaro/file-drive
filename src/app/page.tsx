"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import {  useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

import { z } from "zod";


import UploadButton from "./upload-button";
import FileCard from "./file-card";



const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
 


  

  let orgId: string | null | undefined = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");


  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Reports</h1>

        <UploadButton></UploadButton>
      </div>

    <div className="grid grid-cols-4 gap-4">
    {files?.map((file) => {
        return <FileCard key={file._id} file={file}></FileCard>;
      })}
    </div>
    </main>
  );
}

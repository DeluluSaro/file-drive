"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import {  useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

import { z } from "zod";


import UploadButton from "./upload-button";
import FileCard from "./file-card";
import Image from "next/image";
import { Hospital, SparklesIcon, SplineIcon } from "lucide-react";



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
      

    {files === undefined && (
      <div className="flex flex-col justify-center items-center mt-10"><Hospital className="w-20 h-20 animate-bounce"></Hospital>
      <h1 className="text-2xl">Please wait until we load</h1></div>
    )}

     
     {files && files?.length===0 && (
      <div className="flex flex-col w-[1275px] mr-10  items-center gap-4 mt-10 ">
      <Image src={require('./../../public/nothing.svg')} alt="nothing" width={100} height={100} className="w-[250px] h-[250px] "></Image>
      <h1 className="text-2xl font-bold">No Records Found</h1>
      <UploadButton></UploadButton>
      </div>
     )}

     {files && files.length>0 && (
      <>
      <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">Your Reports</h1>

      <UploadButton></UploadButton>
    </div>
      <div className="grid grid-cols-4 gap-4">
      

    
      {files?.map((file)=>{
        return <FileCard key={file._id} file={file}></FileCard>
      })}
    
    </div>
      </>
     )}


     
    
    
    </main>
  );
}
